import { Request, Response, NextFunction } from 'express';
import { introductionService } from '../services/introduction.service';
import { IntroStage } from '../models/introduction.model';

export class IntroductionHandler {
  /**
   * @swagger
   * /v1/introductions/stage:
   *   post:
   *     summary: Create or update an introduction stage
   *     tags: [Introductions]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/IntroductionStageUpdate'
   *           examples:
   *             updateStage:
   *               summary: Move a contact to lead
   *               value:
   *                 ownerId: "contact-123"
   *                 targetId: "contact-987"
   *                 stage: "lead"
   *     responses:
   *       201:
   *         description: Stage created or updated
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Introduction'
   *       400:
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async setContactStage(req: Request, res: Response, next: NextFunction) {
    try {
      const { ownerId, targetId, stage } = req.body;
      const introduction = await introductionService.setStage(ownerId, targetId, stage);
      res.status(201).json(introduction);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /v1/introductions/stage:
   *   get:
   *     summary: Get introductions for an owner optionally filtered by stage
   *     tags: [Introductions]
   *     parameters:
   *       - in: query
   *         name: ownerId
   *         required: true
   *         schema:
   *           type: string
   *       - in: query
   *         name: stage
   *         required: false
   *         schema:
   *           type: string
   *           enum: [prospect, lead, to-meet, met, not-in-campaign, disqualified]
   *         description: Optional stage filter
   *     responses:
   *       200:
   *         description: List of introductions
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Introduction'
   *       400:
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async getContactsInStage(req: Request, res: Response, next: NextFunction) {
    try {
      const { ownerId, stage } = req.query;
      if (stage) {
        const introductions = await introductionService.getContactsInStage(ownerId as string, stage as IntroStage);
        res.status(200).json(introductions);
      } else {
        const introductions = await introductionService.getIntroductions(ownerId as string);
        res.status(200).json(introductions);
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /v1/introductions/stages/bulk-update:
   *   post:
   *     summary: Bulk update stages for multiple contacts
   *     tags: [Introductions]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/IntroductionBulkStageUpdate'
   *     responses:
   *       204:
   *         description: Stages updated
   *       400:
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async bulkSetContactStage(req: Request, res: Response, next: NextFunction) {
    try {
      const { ownerId, updates } = req.body;
      await introductionService.bulkSetStage(ownerId, updates);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /v1/introductions/stage/summary:
   *   get:
   *     summary: Get counts of contacts per stage for an owner
   *     tags: [Introductions]
   *     parameters:
   *       - in: query
   *         name: ownerId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Stage summary data
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   stage:
   *                     type: string
   *                     enum: [prospect, lead, to-meet, met, not-in-campaign, disqualified]
   *                   count:
   *                     type: number
   *       400:
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async getStageSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const { ownerId } = req.query;
      const summary = await introductionService.getStageSummary(ownerId as string);
      res.status(200).json(summary);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /v1/introductions/stage/recompute:
   *   post:
   *     summary: Recalculate stage counts for an owner and update the contact cache
   *     tags: [Introductions]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               ownerId:
   *                 type: string
   *                 example: contact-123
   *     responses:
   *       200:
   *         description: Updated stage counts
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 ownerId:
   *                   type: string
   *                 stage_counts:
   *                   type: object
   *                   additionalProperties:
   *                     type: integer
   *       400:
   *         description: Validation error
   *       404:
   *         description: Owner contact not found
   */
  async recomputeStageCounts(req: Request, res: Response, next: NextFunction) {
    try {
      const { ownerId } = req.body;
      const stageCounts = await introductionService.recalculateStageCounts(ownerId);
      res.status(200).json({
        ownerId,
        stage_counts: stageCounts,
      });
    } catch (error) {
      next(error);
    }
  }
}
