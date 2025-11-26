import { Request, Response, NextFunction } from 'express';
import { campaignService } from '../services/campaign.service';

export class CampaignHandler {
  async listCampaignContacts(req: Request, res: Response, next: NextFunction) {
    try {
      const ownerId = req.params.id;
      const { limit, startAfter, order_by = 'stage', order_direction = 'asc' } = req.query;
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
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const campaignHandler = new CampaignHandler();
