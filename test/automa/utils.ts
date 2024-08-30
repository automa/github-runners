import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { FastifyInstance } from 'fastify';
import { generateWebhookSignature } from '@automa/bot';

import { env } from '../../src/env';

import { call } from '../utils';

export const callWithFixture = async (
  app: FastifyInstance,
  fileName: string,
) => {
  const body = JSON.parse(
    readFileSync(join(__dirname, 'fixtures', `${fileName}.json`), 'utf8'),
  );

  const signature = generateWebhookSignature(env.AUTOMA.WEBHOOK_SECRET, body);

  return call(app, '/hooks/automa', {
    method: 'POST',
    headers: {
      'x-automa-signature': signature,
    },
    payload: body,
  });
};
