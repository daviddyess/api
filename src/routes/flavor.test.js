import express from 'express';
import request from 'supertest';

import flavor from './flavor';

/* eslint-disable camelcase */
describe('flavor resource', () => {
  const app = express();

  app.use(flavor);

  it('returns valid flavor', done => {
    request(app)
      .get('/123')
      .expect(
        200,
        {
          vendor_code: 'CAP',
          vendor_name: 'Capella',
          flavor_name: 'Pear'
        },
        done
      );
  });

  it('returns 204 for missing flavor', done => {
    request(app)
      .get('/0')
      .expect(204, done);
  });

  it('returns 400 for invalid flavor', done => {
    request(app)
      .get('/ham')
      .expect(400, done);
  });
});
