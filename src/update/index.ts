import { existsSync } from 'node:fs';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { FastifyInstance } from 'fastify';

import { env } from '../env';

import { Config } from './utils';

import { update as regex } from './regex';

export const update = async (
  app: FastifyInstance,
  folder: string,
  config?: Config,
) => {
  const mergedConfig = {
    ...(JSON.parse(env.UPDATE_MAP) as Config),
    ...config,
  };

  if (!Object.entries(mergedConfig).length) {
    app.log.info('Configuration has not specified any runners to be changed');

    return;
  }

  const workflowsDir = join(folder, '.github', 'workflows');

  if (!existsSync(workflowsDir)) {
    app.log.info('No workflows found to change');

    return;
  }

  const workflows = await readdir(workflowsDir);

  for (const workflow of workflows) {
    const file = join(workflowsDir, workflow);
    const contents = await readFile(file, 'utf8');

    await writeFile(file, regex(contents, mergedConfig), 'utf8');
  }
};
