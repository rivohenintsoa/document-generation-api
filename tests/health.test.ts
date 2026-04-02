import request from 'supertest';
import app from '../src/app'; 

describe('Health Endpoint', () => {
  it('should return status ok with mongo, redis and queue', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('mongo');
    expect(res.body).toHaveProperty('redis');
    expect(res.body).toHaveProperty('queue');
    expect(['ok', 'error']).toContain(res.body.status);
  });
});