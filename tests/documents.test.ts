import request from 'supertest';
import app from '../src/app';
import { DocumentModel } from '../src/modules/document/models/document.model';

it('should return a PDF', async () => {
  const doc = await DocumentModel.create({
    batchId: 'test',
    userId: 1,
    content: Buffer.from('test').toString('base64'),
    status: 'done',
  });

  const res = await request(app).get(`/api/documents/${doc._id}`);

  expect(res.status).toBe(200);
});