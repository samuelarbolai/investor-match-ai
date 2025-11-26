import { Timestamp } from 'firebase-admin/firestore';
import { collections, db } from '../config/firebase';
import { Contact } from '../models/contact.model';
import { Introduction, IntroStage, STAGE_RANK } from '../models/introduction.model';

export type CampaignContactsOrderBy = 'stage' | 'updated_at';

export interface CampaignContactsParams {
  limit: number;
  startAfter?: string;
  orderBy: CampaignContactsOrderBy;
  orderDirection: 'asc' | 'desc';
}

export interface CampaignContactRecord {
  contact: Contact;
  campaign_stage: IntroStage;
  campaign_stage_rank: number;
  introduced_at: Timestamp;
  updated_at: Timestamp;
  metadata?: Record<string, unknown>;
}

export interface CampaignContactsResponse {
  data: CampaignContactRecord[];
  pagination: {
    limit: number;
    hasMore: boolean;
    nextCursor?: string;
  };
}

export class CampaignService {
  async getCampaignContacts(ownerId: string, params: CampaignContactsParams): Promise<CampaignContactsResponse> {
    const { limit, startAfter, orderBy, orderDirection } = params;

    let query = collections
      .introductions()
      .where('ownerId', '==', ownerId);

    if (orderBy === 'stage') {
      query = query
        .orderBy('stage_rank', orderDirection)
        .orderBy('updatedAt', orderDirection);
    } else {
      query = query.orderBy('updatedAt', orderDirection);
    }

    if (startAfter) {
      const cursorDoc = await collections.introductions().doc(startAfter).get();
      if (!cursorDoc.exists) {
        throw new Error(`startAfter cursor ${startAfter} not found for owner ${ownerId}`);
      }
      query = query.startAfter(cursorDoc);
    }

    const snapshot = await query.limit(limit + 1).get();
    const docs = snapshot.docs;
    const hasMore = docs.length > limit;
    const pageDocs = hasMore ? docs.slice(0, limit) : docs;
    const nextCursor = hasMore ? docs[limit].id : undefined;

    if (!pageDocs.length) {
      return {
        data: [],
        pagination: {
          limit,
          hasMore: false,
        },
      };
    }

    const introductions = pageDocs.map((doc) => ({ id: doc.id, ...(doc.data() as Introduction) }));
    const targetIds = introductions.map((intro) => intro.targetId);
    const contactRefs = targetIds.map((id) => collections.contacts().doc(id));
    const contactDocs = await db.getAll(...contactRefs);
    const contactMap = new Map<string, Contact>();
    contactDocs.forEach((doc) => {
      if (doc.exists) {
        const data = doc.data() as Contact;
        contactMap.set(doc.id, { ...data, id: doc.id });
      }
    });

    const data: CampaignContactRecord[] = introductions.reduce<CampaignContactRecord[]>((acc, intro) => {
      const contact = contactMap.get(intro.targetId);
      if (!contact) {
        return acc;
      }
      acc.push({
        contact,
        campaign_stage: intro.stage,
        campaign_stage_rank: intro.stage_rank ?? STAGE_RANK[intro.stage],
        introduced_at: intro.createdAt,
        updated_at: intro.updatedAt,
        metadata: intro.metadata,
      });
      return acc;
    }, []);

    return {
      data,
      pagination: {
        limit,
        hasMore,
        nextCursor,
      },
    };
  }
}

export const campaignService = new CampaignService();
