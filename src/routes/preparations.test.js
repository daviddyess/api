import preparations from './preparations';
import database from 'modules/database';
import { captureTestErrors, tryCatch, bootstrapApp } from 'modules/utils/test';

describe('preparations route resource', () => {
  const app = bootstrapApp(preparations);
  const request = captureTestErrors(app);

  afterAll(() => Promise.all(database.sequelize.close(), app.close()));

  it(
    'returns valid list of 2 preparations',
    tryCatch((done) => {
      request.get('/?limit=2').expect(200, done);
    })
  );

  it(
    'returns 200 for preparations list',
    tryCatch((done) => {
      request.get('/?offset=9000000').expect(200, done);
    })
  );

  it(
    'returns 400 for invalid preparations list',
    tryCatch((done) => {
      request.get('/?limit=stop').expect(400, done);
    })
  );
});
