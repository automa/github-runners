import { existsSync } from 'node:fs';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { env } from '../env';
import { logger, SeverityNumber } from '../telemetry';

import { Config } from './utils';

import { update as regex } from './regex';

export const update = async (folder: string, config?: Config) => {
  const mergedConfig = {
    ...(JSON.parse(env.UPDATE_MAP) as Config),
    ...config,
  };

  if (!Object.entries(mergedConfig).length) {
    logger.emit({
      severityNumber: SeverityNumber.INFO,
      body: 'Configuration has not specified any runners to be changed',
    });

    return;
  }

  const workflowsDir = join(folder, '.github', 'workflows');

  if (!existsSync(workflowsDir)) {
    logger.emit({
      severityNumber: SeverityNumber.INFO,
      body: 'No workflows found to change',
    });

    return;
  }

  const workflows = await readdir(workflowsDir);

  for (const workflow of workflows) {
    const file = join(workflowsDir, workflow);
    const contents = await readFile(file, 'utf8');

    await writeFile(file, regex(contents, mergedConfig), 'utf8');
  }
};
