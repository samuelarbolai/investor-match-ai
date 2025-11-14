import { Contact, ContactInput } from '../models/contact.model';

export class ContactService {
  async createContact(input: ContactInput): Promise<Contact> {
    // TODO: Implement contact creation
    throw new Error('Not implemented');
  }

  async getContact(id: string): Promise<Contact | null> {
    // TODO: Implement contact retrieval
    throw new Error('Not implemented');
  }

  async updateContact(id: string, updates: Partial<ContactInput>): Promise<Contact> {
    // TODO: Implement contact update
    throw new Error('Not implemented');
  }

  async deleteContact(id: string): Promise<void> {
    // TODO: Implement contact deletion
    throw new Error('Not implemented');
  }
}
