import { collections, Timestamp, admin } from '../config/firebase';
import { Company } from '../models/company.model';
import { Experience } from '../models/experience.model';
import { ensureValidDocumentId } from '../utils/document-id';

export class CompanySyncService {
  async syncCompanies(
    contactId: string,
    companies: Company[],
    experiences: Experience[]
  ): Promise<void> {
    for (const company of companies) {
      const docRef = collections.companies().doc(company.id);
      await docRef.set({
        id: company.id,
        name: company.name,
        domain: company.domain ?? null,
        description: company.description ?? null,
        linkedin_url: company.linkedin_url ?? null,
        crunchbase_url: company.crunchbase_url ?? null,
        industries: company.industries ?? [],
        verticals: company.verticals ?? [],
        contact_ids: admin.firestore.FieldValue.arrayUnion(contactId),
        updated_at: Timestamp.now()
      }, { merge: true });
    }

    for (const exp of experiences) {
      const companyId = exp.company_id || (exp.company_name ? ensureValidDocumentId(exp.company_name) : null);
      if (!companyId) continue;
      const expId = `${contactId}_${companyId}_${exp.start_date}`;
      const expRef = collections.experiences().doc(expId);
      await expRef.set({
        id: expId,
        contact_id: contactId,
        company_id: companyId,
        company_name: exp.company_name,
        role: exp.role,
        seniority: exp.seniority,
        start_date: exp.start_date,
        end_date: exp.end_date,
        current: exp.current,
        description: exp.description,
        location_city: exp.location_city,
        location_country: exp.location_country,
        updated_at: Timestamp.now()
      }, { merge: true });
    }
  }
}

export const companySyncService = new CompanySyncService();
