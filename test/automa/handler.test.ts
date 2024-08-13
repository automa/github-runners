import { FastifyInstance } from 'fastify';
import { assert } from 'chai';

import { call, server } from '../utils';

suite('automa hook', () => {
  let app: FastifyInstance;

  suiteSetup(async () => {
    app = await server();
  });

  suiteTeardown(async () => {
    await app.close();
  });

  test('with no signature should return 401', async () => {
    const response = await call(app, '/hooks/automa', {
      method: 'POST',
      headers: {},
      payload: {},
    });

    assert.equal(response.statusCode, 401);
  });

  test('with invalid signature should return 401', async () => {
    const response = await call(app, '/hooks/automa', {
      method: 'POST',
      headers: {
        'x-automa-signature': 'invalid',
      },
      payload: {},
    });

    assert.equal(response.statusCode, 401);
  });
});
