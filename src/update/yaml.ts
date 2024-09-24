// We would love to use YAML parser to update runners in the workflow file.
// But it has issues with preserving format. So we will use regex to update runners.
//
// * https://github.com/eemeli/yaml/issues/570
// * https://github.com/eemeli/yaml/issues/572

import {
  isScalar,
  ParsedNode,
  parseDocument,
  Scalar,
  YAMLMap,
  YAMLSeq,
} from 'yaml';

import { Config, updateRunner } from './utils';

type Map = YAMLMap.Parsed | undefined;
type Seq = YAMLSeq.Parsed | undefined;

const matrixExpressionRegex = /\${{\s*matrix\.([a-zA-Z0-9_\-]+)\s*}}/;

export const update = (contents: string, config: Config) => {
  const data = parseDocument(contents);
  const jobs = data.get('jobs') as Map;

  if (!jobs) {
    return contents;
  }

  jobs.items.forEach((job) => {
    const jobDefinition = job.value as Map;
    const runsOn = jobDefinition?.get('runs-on', true);

    if (!runsOn || !isScalar(runsOn)) {
      return;
    }

    const value = runsOn.value as unknown as string;

    runsOn.value = updateRunner(value, config) as unknown as ParsedNode;

    // Handle runners specified in matrix strategy
    const matches = value.trim().match(matrixExpressionRegex);

    if (!matches) {
      return;
    }

    const matrix = (jobDefinition?.get('strategy') as Map)?.get(
      'matrix',
    ) as Map;

    const values = matrix?.get(matches[1]) as Seq;

    if (values) {
      (values.items as Scalar.Parsed[]).forEach((value) => {
        value.value = updateRunner(value.value as string, config);
      });
    }

    ((matrix?.get('include') as Seq)?.items as YAMLMap.Parsed[]).forEach(
      (include) => {
        const value = include.get(matches[1], true);

        if (value) {
          value.value = updateRunner(
            value.value as unknown as string,
            config,
          ) as unknown as ParsedNode;
        }
      },
    );

    ((matrix?.get('exclude') as Seq)?.items as YAMLMap.Parsed[]).forEach(
      (exclude) => {
        const value = exclude.get(matches[1], true);

        if (value) {
          value.value = updateRunner(
            value.value as unknown as string,
            config,
          ) as unknown as ParsedNode;
        }
      },
    );
  });

  return data.toString();
};
