import { Request, Response, NextFunction } from 'express';
import { campaignService } from '../services/campaign.service';

const normalizeTags = (input: unknown): string[] => {
  if (!input) return [];
  const raw = Array.isArray(input) ? input : [input];
  return raw
    .flatMap(value => String(value).split(','))
    .map(tag => tag.trim().toLowerCase())
    .filter(tag => Boolean(tag));
};

/**
 * @swagger
 * /v1/owners/{id}/campaign-contacts:
 *   get:
 *     summary: List campaign contacts for an owner
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Owner/contact ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 25
 *       - in: query
 *         name: startAfter
 *         schema:
 *           type: string
 *         description: Introduction document ID to start after (pagination)
 *       - in: query
 *         name: order_by
 *         schema:
 *           type: string
 *           enum: [stage, updated_at]
 *         description: Order by campaign stage or last update
 *       - in: query
 *         name: order_direction
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *       - in: query
 *         name: exclude_tags
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Tags to exclude from returned contacts (e.g., coverage, test)
 *     responses:
 *       200:
 *         description: Campaign contacts page
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
export class CampaignHandler {
  async listCampaignContacts(req: Request, res: Response, next: NextFunction) {
    try {
      const ownerId = req.params.id;
      const { limit, startAfter, order_by = 'stage', order_direction = 'asc', exclude_tags } = req.query;
      const parsedLimit = typeof limit === 'number' ? limit : Number(limit ?? 25);
      const parsedOrderBy =
        (order_by as 'stage' | 'updated_at' | undefined) ?? 'stage';
      const parsedDirection =
        (order_direction as 'asc' | 'desc' | undefined) ?? 'asc';
      const result = await campaignService.getCampaignContacts(ownerId, {
        limit: parsedLimit,
        startAfter: startAfter as string | undefined,
        orderBy: parsedOrderBy,
        orderDirection: parsedDirection,
        excludeTags: normalizeTags(exclude_tags),
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const campaignHandler = new CampaignHandler();
