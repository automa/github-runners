import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { assert } from 'chai';
import { $ } from 'zx';

import { update } from '../src/update';
import { Config } from '../src/update/utils';

suite('update', () => {
  test('should do nothing if no files are present', async () => {
    await runFixture('empty');
  });

  test('should not change latest if no changes', async () => {
    await runFixture('prefer_latest');
  });

  test('should update runners', async () => {
    await runFixture('normal');
  });

  test('should update runners in multiple workflows', async () => {
    await runFixture('multiple');
  });

  test('should ignore if runner does not match exactly', async () => {
    await runFixture('ignore_non_exact');
  });

  test('should ignore group value', async () => {
    await runFixture('ignore_group');
  });

  test('should update runners in quotes', async () => {
    await runFixture('quotes');
  });

  test('should update runners in matrix values', async () => {
    await runFixture('matrix', {
      'ubuntu-22.04': 'warp-ubuntu-latest-x64-4x',
      'macos-14': 'warp-macos-latest-arm64-6x',
    });
  });

  test('should update input for reusable workflows', async () => {
    await runFixture('reusable', {
      'ubuntu-22.04': 'warp-ubuntu-latest-x64-4x',
      'macos-14': 'warp-macos-latest-arm64-6x',
    });
  });

  test.skip('should update anchors', async () => {
    // Github Actions does not support anchors and aliases in YAML
  });
});

const runFixture = async (folder: string, config?: Config) => {
  const runPath = join(__dirname, 'fixtures', '_run');
  const fixture = join(__dirname, 'fixtures', folder);
  const snapshotPath = join(
    __dirname,
    'fixtures',
    '__snapshots__',
    `${folder}.snapshot`,
  );

  await $`rm -rf ${runPath}`;
  await $({ cwd: __dirname })`cp -r ${fixture} ${runPath}`;

  await $({ cwd: runPath })`git init`;
  await $({ cwd: runPath })`git add .`;
  await $({ cwd: runPath })`git config user.name Tmp`;
  await $({ cwd: runPath })`git config user.email tmp@tmp.com`;
  await $({ cwd: runPath })`git commit --allow-empty -m "Initial commit"`;

  try {
    await update(runPath, config);

    const diff = await $({ cwd: runPath })`git diff`;
    let snapshot = '';

    if (existsSync(snapshotPath)) {
      snapshot = await readFile(snapshotPath, 'utf8');
    }

    assert.equal(diff.stdout, snapshot);
  } finally {
    await $`rm -rf ${runPath}`;
  }
};
