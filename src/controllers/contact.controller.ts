import { Request, Response } from 'express';
import { ContactService } from '../services/contact.service';

export class ContactController {
  private contactService = new ContactService();

  async createContact(req: Request, res: Response): Promise<void> {
    // TODO: Implement contact creation endpoint
    res.status(501).json({ error: 'Not implemented' });
  }

  async getContact(req: Request, res: Response): Promise<void> {
    // TODO: Implement contact retrieval endpoint
    res.status(501).json({ error: 'Not implemented' });
  }
}
