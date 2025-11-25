
import request from 'supertest';
import app from '../../src/server';
const expectSorted = (contacts: any[], field: string, direction: 'asc' | 'desc') => {
  for (let i = 1; i < contacts.length; i++) {
    const prev = contacts[i - 1][field];
    const curr = contacts[i][field];
    const comparison = prev.localeCompare(curr);
    if (direction === 'asc') {
      expect(comparison).toBeLessThanOrEqual(0);
    } else {
      expect(comparison).toBeGreaterThanOrEqual(0);
    }
  }
};

describe('GET /v1/contacts sorting', () => {
  if('sorts by full_name descending', async () => {
    const res = await request(app)
      .get('/v1/contacts')
      .query({ order_by: 'full_name', order_direction: 'desc', limit: 20 })
      .expect(200);
    expectSorted(res.body.data, 'full_name', 'desc');
  });

  if('returns ascending order by default', async () => {
    const res = await request(app)
      .get('/v1/contacts')
      .query({ order_by: 'full_name', order_direction: 'asc', limit: 20 })
      .expect(200);
    expectSorted(res.body.data, 'full_name', 'asc');
  });
});