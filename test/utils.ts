/* eslint-disable import/first */
// Testing environment variables
process.env.UPDATE_MAP = '{"ubuntu-24.04":"blacksmith-4vcpu-ubuntu-2204"}';

// Import the modules to use their typings
import '../src/plugins/error';

import { FastifyInstance, InjectOptions } from 'fastify';

export { server } from '../src';

export const call = (
  app: FastifyInstance,
  uri: string,
  options?: Omit<InjectOptions, 'url' | 'path' | 'server' | 'Request'>,
) =>
  app.inject({
    url: uri,
    ...options,
  });
