import { Request, Response } from 'express';
import { db } from '../config/firebase';
import { Match, MatchRequest } from '../models/match.model';

export class MatchHandler {
  async findMatches(req: Request, res: Response): Promise<void> {
    try {
      const { contactId, limit = 10 }: MatchRequest = req.body;
      
      // TODO: Implement actual matching algorithm
      // For now, return mock matches
      const matches: Match[] = [];
      
      res.json({ contactId, matches, count: matches.length });
    } catch (error) {
      res.status(500).json({ error: 'Failed to find matches' });
    }
  }

  async getMatches(req: Request, res: Response): Promise<void> {
    try {
      const { contactId } = req.params;
      const matchesSnapshot = await db.collection('matches')
        .where('contactId', '==', contactId)
        .get();
      
      const matches = matchesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      res.json({ contactId, matches });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get matches' });
    }
  }
}
