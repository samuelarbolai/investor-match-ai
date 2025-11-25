import { listContactsQuerySchema } from '../../../src/validators/contact.validator';

describe('listContactsQuerySchema', () => {
  it('applies defaults', () => {
    const { value, error } = listContactsQuerySchema.validate({});
    expect(error).toBeUndefined();
    expect(value.order_by).toBe('created_at');
    expect(value.order_direction).toBe('asc');
  });

  it('rejects invalid order_by', () => {
    const { error } = listContactsQuerySchema.validate({ order_by: 'not_field' });
    expect(error).toBeTruthy();
  });
});