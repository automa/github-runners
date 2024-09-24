enum Runner {
  Ubuntu2404 = 'ubuntu-24.04',
  Ubuntu2204 = 'ubuntu-22.04',
  Ubuntu2004 = 'ubuntu-20.04',
  MacOS14Large = 'macos-14-large',
  MacOS14 = 'macos-14',
  MacOS14XLarge = 'macos-14-xlarge',
  MacOS13 = 'macos-13',
  MacOS13Large = 'macos-13-large',
  MacOS13XLarge = 'macos-13-xlarge',
  MacOS12 = 'macos-12',
  MacOS12Large = 'macos-12-large',
  Windows2022 = 'windows-2022',
  Windows2019 = 'windows-2019',
}

enum Latest {
  Ubuntu = 'ubuntu-latest',
  MacOSLarge = 'macos-latest-large',
  MacOS = 'macos-latest',
  MacOSXLarge = 'macos-latest-xlarge',
  Windows = 'windows-latest',
}

export type Config = Record<string, string>;

export const LATEST: {
  [key in Latest]: Runner;
} = {
  [Latest.Ubuntu]: Runner.Ubuntu2204,
  [Latest.Windows]: Runner.Windows2022,
  [Latest.MacOS]: Runner.MacOS14,
  [Latest.MacOSLarge]: Runner.MacOS14Large,
  [Latest.MacOSXLarge]: Runner.MacOS14XLarge,
};

export const updateRunner = (oldRunner: string, config: Config) => {
  return config[LATEST[oldRunner as Latest] ?? oldRunner] ?? oldRunner;
};
