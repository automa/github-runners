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
    WEBHOOK_SECRET: Type.String({
      default: 'atma_whsec_github-runners',
    }),
  }),
  PORT: Type.Number({
    default: 5001,
  }),
  SENTRY_DSN: Type.String({
    default: '',
  }),
});

type Schema = Static<typeof schema>;

export const env = envSchema<Schema>({ schema });
