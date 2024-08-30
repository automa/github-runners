import { dirname, join } from 'node:path';

import { Static, Type } from '@sinclair/typebox';
import envSchema from 'nested-env-schema';

// @ts-ignore
import pkg from '../package.json';

export const environment = process.env.NODE_ENV || 'development';

export const isTest = environment === 'test';
export const isProduction = !isTest && environment !== 'development';

export const product = 'github-runners';
export const service = 'bot';
export const version = pkg.version;

const schema = Type.Object({
  AUTOMA: Type.Object({
    BASE_URL: Type.String({
      default: 'http://localhost:8080',
    }),
    WEBHOOK_SECRET: Type.String({
      default: 'atma_whsec_github-runners',
    }),
  }),
  COMMIT_MESSAGE: Type.String({
    default: '',
  }),
  PORT: Type.Number({
    default: 5004,
  }),
  SENTRY_DSN: Type.String({
    default: '',
  }),
  UPDATE_MAP: Type.String({
    default: '{}',
  }),
});

type Schema = Static<typeof schema>;

export const env = envSchema<Schema>({
  schema,
  dotenv: {
    path: join(dirname(__dirname), '.env'),
  },
});
