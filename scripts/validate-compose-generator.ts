import {mkdirSync, writeFileSync, rmSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {spawnSync} from 'node:child_process';

import {
  buildComposeFiles,
  defaultOptionsForPreset,
  type ComposeGeneratorOptions,
} from '../src/tools/utils/composeGenerator';
import type {ComposePresetId} from '../src/tools/data/composePresets';

type Case = {
  name: string;
  options: ComposeGeneratorOptions;
};

function cases(): Case[] {
  const presets: ComposePresetId[] = [
    'mysql',
    'mariadb',
    'postgres',
    'redis',
    'nginx',
  ];
  const list: Case[] = [];

  for (const presetId of presets) {
    list.push({
      name: `${presetId}-default`,
      options: defaultOptionsForPreset(presetId),
    });
  }

  list.push({
    name: 'mysql-localhost-port',
    options: {
      ...defaultOptionsForPreset('mysql'),
      portMode: 'localhost',
      hostPort: '3306',
    },
  });

  list.push({
    name: 'postgres-external-network',
    options: {
      ...defaultOptionsForPreset('postgres'),
      networkMode: 'external',
      externalNetworkName: 'app-net',
      portMode: 'internal',
    },
  });

  list.push({
    name: 'redis-bind-volume',
    options: {
      ...defaultOptionsForPreset('redis'),
      persistMode: 'bind',
      bindDataPath: './redis/data',
      configMount: true,
    },
  });

  list.push({
    name: 'mariadb-named-readonly',
    options: {
      ...defaultOptionsForPreset('mariadb'),
      persistMode: 'named',
      enableBinlog: true,
      readOnly: true,
      portMode: 'localhost',
      hostPort: '3307',
    },
  });

  list.push({
    name: 'nginx-no-persist-localhost',
    options: {
      ...defaultOptionsForPreset('nginx'),
      persistMode: 'none',
      portMode: 'localhost',
      hostPort: '8080',
      configMount: true,
    },
  });

  return list;
}

function runComposeConfig(dir: string): {ok: boolean; output: string} {
  const result = spawnSync(
    'docker',
    ['compose', '-f', 'compose.yaml', 'config', '--quiet'],
    {
      cwd: dir,
      encoding: 'utf8',
      env: {
        ...process.env,
        MYSQL_ROOT_PASSWORD: 'Example-only-Root-42!',
        MARIADB_ROOT_PASSWORD: 'Example-only-Maria-42!',
        POSTGRES_PASSWORD: 'Example-only-Postgres-42!',
      },
    },
  );
  const output = `${result.stdout || ''}${result.stderr || ''}`;
  return {ok: result.status === 0, output};
}

function main(): void {
  const docker = spawnSync('docker', ['compose', 'version'], {encoding: 'utf8'});
  if (docker.status !== 0) {
    console.error('docker compose is required for validation');
    console.error(docker.stderr);
    process.exit(1);
  }

  const root = join(tmpdir(), `origemite-compose-gen-${Date.now()}`);
  mkdirSync(root, {recursive: true});
  let failed = 0;

  try {
    for (const testCase of cases()) {
      const dir = join(root, testCase.name);
      mkdirSync(dir, {recursive: true});
      const {composeYaml, envExample} = buildComposeFiles(testCase.options);
      writeFileSync(join(dir, 'compose.yaml'), composeYaml, 'utf8');
      if (envExample) {
        writeFileSync(join(dir, '.env'), envExample, 'utf8');
      }
      // External networks must exist for `config` in some compose versions;
      // --quiet config still validates references. Create a dummy external net name
      // only as declaration — Compose config accepts external:true without the net existing
      // for `docker compose config` in modern Compose.
      const {ok, output} = runComposeConfig(dir);
      if (!ok) {
        failed += 1;
        console.error(`FAIL ${testCase.name}`);
        console.error(output);
        console.error('--- compose.yaml ---');
        console.error(composeYaml);
      } else {
        console.log(`OK   ${testCase.name}`);
      }
    }
  } finally {
    rmSync(root, {recursive: true, force: true});
  }

  if (failed > 0) {
    console.error(`\n${failed} case(s) failed`);
    process.exit(1);
  }
  console.log(`\nAll ${cases().length} cases passed docker compose config`);
}

main();
