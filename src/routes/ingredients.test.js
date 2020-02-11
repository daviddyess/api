import express from 'express';
import passport from 'passport';
import AnonymousStrategy from 'passport-anonymous';

import ingredients from './ingredients';
import database from 'modules/database';
import { captureTestErrors, tryCatch } from 'modules/utils/test';

describe('ingredients route resource', () => {
  const app = express();

  passport.use(new AnonymousStrategy());
  app.use(ingredients);

  const request = captureTestErrors(app);

  afterAll(() => Promise.all(database.sequelize.close(), app.close()));

  it(
    'returns valid list of 2 ingredients',
    tryCatch(done => {
      request.get('/?limit=2').expect(200, done);
    })
  );

  it(
    'returns 200 for missing ingredients list',
    tryCatch(done => {
      request.get('/?offset=800000').expect(200, done);
    })
  );

  it(
    'returns 400 for invalid ingredient list',
    tryCatch(done => {
      request.get('/?limit=stop').expect(400, done);
    })
  );

  it(
    'returns valid stats',
    tryCatch(done => {
      request.get('/count').expect(200, done);
    })
  );
});
