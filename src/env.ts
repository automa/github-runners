import { dirname, join } from 'node:path';

import envSchema from 'nested-env-schema';
import { z } from 'zod/v4';

import './telemetry';

// @ts-ignore
import pkg from '../package.json';

export const environment = process.env.NODE_ENV || 'development';

export const isTest = environment === 'test';
export const isProduction = !isTest && environment !== 'development';

export const product = 'bots';
export const service = 'github-runners';
export const version = pkg.version;

const schema = z.object({
  AUTOMA: z.object({
    WEBHOOK_SECRET: z.string().default('atma_whsec_github-runners'),
  }),
  COMMIT_MESSAGE: z.string().optional(),
  PORT: z.number().default(5004),
  SENTRY_DSN: z.string().optional(),
  UPDATE_MAP: z.string().default('{}'),
});

type Schema = z.infer<typeof schema>;

export const env = envSchema<Schema>({
  schema: z.toJSONSchema(schema),
  dotenv: {
    path: join(dirname(__dirname), isTest ? '.env.test' : '.env'),
  },
});
