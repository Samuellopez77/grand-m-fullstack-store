   import { test, describe } from 'node:test';
   import assert from 'node:assert/strict';
   import request from 'supertest';
   import app from '../app.js';

   describe('GET /api/health', () => {
     test('returns 200 with status ok, uptime, and timestamp', async () => {
       const res = await request(app).get('/api/health');

       assert.equal(res.status, 200);
       assert.equal(res.body.status, 'ok');
       assert.equal(typeof res.body.uptime, 'number');
       assert.ok(!Number.isNaN(Date.parse(res.body.timestamp)));
     });
   });

   describe('unknown /api routes', () => {
     test('return a JSON 404, not the SPA index.html', async () => {
       const res = await request(app).get('/api/does-not-exist');

       assert.equal(res.status, 404);
       assert.match(res.headers['content-type'], /application\/json/);
       assert.deepEqual(res.body, { error: 'Not found' });
     });
   });