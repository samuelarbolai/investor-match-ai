import { findExistingContact, normalizeString, prepareContactPayload } from '../../src/handlers/contact.handler';

const mockWhere = jest.fn();
const mockLimit = jest.fn();
const mockGet = jest.fn();

jest.mock('../../src/config/firebase', () => {
  return {
    collections: {
      contacts: () => ({
        where: mockWhere,
      }),
    },
  };
});

describe('contact handler helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockWhere.mockReturnValue({
      limit: mockLimit.mockReturnValue({
        get: mockGet,
      }),
    });
  });

  it('normalizes email and linkedin in prepareContactPayload', () => {
    const payload = {
      full_name: 'Test User',
      contact_type: 'founder',
      email: 'TEST@EXAMPLE.COM ',
      linkedin_url: 'HTTPS://LinkedIn.COM/in/Example ',
    };
    const { contact } = prepareContactPayload(payload as any);
    expect(contact.email).toBe('test@example.com');
    expect(contact.linkedin_url).toBe('https://linkedin.com/in/example');
  });

  it('findExistingContact returns null when none found', async () => {
    mockGet.mockResolvedValue({ empty: true });
    const result = await findExistingContact({ email: 'none@example.com' });
    expect(result).toBeNull();
    expect(mockWhere).toHaveBeenCalledWith('email', '==', 'none@example.com');
  });

  it('findExistingContact returns existing when email matches', async () => {
    mockGet.mockResolvedValue({
      empty: false,
      docs: [{ id: 'abc', data: () => ({ full_name: 'Existing' }) }],
    });
    const result = await findExistingContact({ email: 'EXISTING@example.com' });
    expect(result?.id).toBe('abc');
    expect(result?.full_name).toBe('Existing');
    expect(mockWhere).toHaveBeenCalledWith('email', '==', 'existing@example.com');
  });
});
