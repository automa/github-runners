import { Config, LATEST } from './utils';

export const update = (contents: string, config: Config) => {
  let result = contents;

  // For all latest runners, add them to the config with the new runner for them
  Object.entries(LATEST).forEach(([latest, runner]) => {
    config[latest] = config[runner] ?? latest;
  });

  // Main update logic using regex
  // https://regexr.com/869o7
  Object.entries(config).map(([oldRunner, newRunner]) => {
    const regex = new RegExp(
      `(?<!runs\\-on\\s*:\\s+(\\{\\s*)?group\\s*:\\s+)(?<=[\\s"'\[,])(${oldRunner})(?=[\\s"'\\],}])`,
      'g',
    );

    result = result.replace(regex, newRunner);
  });

  return result;
};
