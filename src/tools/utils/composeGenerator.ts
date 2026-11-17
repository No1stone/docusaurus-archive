import {
  COMPOSE_PRESETS,
  type ComposePresetId,
} from '../data/composePresets';

export type PortMode = 'internal' | 'localhost';
export type NetworkMode = 'default' | 'external';
export type PersistMode = 'none' | 'named' | 'bind';

export type ComposeGeneratorOptions = {
  presetId: ComposePresetId;
  imageTag: string;
  serviceName: string;
  portMode: PortMode;
  hostPort: string;
  networkMode: NetworkMode;
  externalNetworkName: string;
  persistMode: PersistMode;
  bindDataPath: string;
  namedVolumeName: string;
  configMount: boolean;
  restart: boolean;
  healthcheck: boolean;
  /** MySQL / MariaDB */
  serverId: string;
  enableBinlog: boolean;
  readOnly: boolean;
  /** MySQL only */
  superReadOnly: boolean;
};

export type ComposeGeneratorResult = {
  composeYaml: string;
  envExample: string | null;
};

function quoteIfNeeded(value: string): string {
  if (/[:#{}[\],&*?|<>=!%@`]/.test(value) || value.includes(' ')) {
    return JSON.stringify(value);
  }
  return value;
}

function indentBlock(lines: string[], level: number): string {
  const pad = '  '.repeat(level);
  return lines.map((line) => (line.length ? `${pad}${line}` : '')).join('\n');
}

function envRef(name: string, fallback?: string): string {
  return fallback ? `\${${name}:-${fallback}}` : `\${${name}}`;
}

export function buildComposeFiles(
  options: ComposeGeneratorOptions,
): ComposeGeneratorResult {
  const preset = COMPOSE_PRESETS[options.presetId];
  const service = options.serviceName.trim() || preset.defaultServiceName;
  const image = options.imageTag.trim() || preset.defaultImage;
  const hostPort =
    options.hostPort.trim() || String(preset.defaultHostPort);

  const serviceLines: string[] = [];
  serviceLines.push(`image: ${image}`);
  serviceLines.push(`container_name: ${service}`);

  if (options.restart) {
    serviceLines.push('restart: unless-stopped');
  }

  if (options.portMode === 'localhost') {
    serviceLines.push('ports:');
    serviceLines.push(
      `  - "127.0.0.1:${hostPort}:${preset.containerPort}"`,
    );
  }

  if (options.networkMode === 'external') {
    const net =
      options.externalNetworkName.trim() || 'shared-network';
    serviceLines.push('networks:');
    serviceLines.push(`  - ${net}`);
  }

  const envLines: string[] = [];
  const dotenvLines: string[] = [];
  const commandLines: string[] = [];

  if (options.presetId === 'mysql' || options.presetId === 'mariadb') {
    const isMysql = options.presetId === 'mysql';
    const rootKey = isMysql ? 'MYSQL_ROOT_PASSWORD' : 'MARIADB_ROOT_PASSWORD';
    const dbKey = isMysql ? 'MYSQL_DATABASE' : 'MARIADB_DATABASE';
    const examplePw = isMysql
      ? 'Example-only-Root-42!'
      : 'Example-only-Maria-42!';

    serviceLines.push('environment:');
    serviceLines.push('  TZ: Asia/Seoul');
    serviceLines.push(`  ${rootKey}: ${envRef(rootKey)}`);
    serviceLines.push(`  ${dbKey}: ${envRef(dbKey, 'app')}`);

    dotenvLines.push(`${rootKey}=${examplePw}`);
    dotenvLines.push(`${dbKey}=app`);
    if (options.portMode === 'localhost') {
      dotenvLines.push(
        `${isMysql ? 'MYSQL_PORT' : 'MARIADB_PORT'}=${hostPort}`,
      );
    }

    const charsetCollation = isMysql
      ? ['--character-set-server=utf8mb4', '--collation-server=utf8mb4_0900_ai_ci']
      : ['--character-set-server=utf8mb4', '--collation-server=utf8mb4_unicode_ci'];

    commandLines.push(...charsetCollation);
    commandLines.push('--lower-case-table-names=1');
    if (!isMysql) {
      commandLines.push('--default-time-zone=+09:00');
    }

    const serverIdKey = isMysql ? 'MYSQL_SERVER_ID' : 'MARIADB_SERVER_ID';
    const defaultServerId = isMysql ? '1' : '11';
    const serverId = options.serverId.trim() || defaultServerId;
    commandLines.push(`--server-id=${envRef(serverIdKey, serverId)}`);
    dotenvLines.push(`${serverIdKey}=${serverId}`);

    if (options.enableBinlog) {
      commandLines.push(
        isMysql ? '--log-bin=mysql-bin' : '--log-bin=mariadb-bin',
      );
      commandLines.push('--binlog-format=ROW');
      commandLines.push('--binlog-row-image=FULL');
      commandLines.push('--binlog-expire-logs-seconds=604800');
      commandLines.push('--relay-log=relay-bin');
      commandLines.push(
        isMysql ? '--log-replica-updates=ON' : '--log-slave-updates=ON',
      );
      commandLines.push('--sync-binlog=1');
    }

    const readOnlyKey = isMysql ? 'MYSQL_READ_ONLY' : 'MARIADB_READ_ONLY';
    const readOnlyVal = options.readOnly ? 'ON' : 'OFF';
    commandLines.push(`--read-only=${envRef(readOnlyKey, readOnlyVal)}`);
    dotenvLines.push(`${readOnlyKey}=${readOnlyVal}`);

    if (isMysql) {
      const superVal = options.superReadOnly ? 'ON' : 'OFF';
      commandLines.push(
        `--super-read-only=${envRef('MYSQL_SUPER_READ_ONLY', superVal)}`,
      );
      dotenvLines.push(`MYSQL_SUPER_READ_ONLY=${superVal}`);
    }

    commandLines.push('--default-storage-engine=InnoDB');
    commandLines.push('--innodb-flush-log-at-trx-commit=1');
  }

  if (options.presetId === 'postgres') {
    serviceLines.push('environment:');
    serviceLines.push('  TZ: Asia/Seoul');
    serviceLines.push(`  POSTGRES_USER: ${envRef('POSTGRES_USER', 'postgres')}`);
    serviceLines.push(`  POSTGRES_PASSWORD: ${envRef('POSTGRES_PASSWORD')}`);
    serviceLines.push(`  POSTGRES_DB: ${envRef('POSTGRES_DB', 'app')}`);
    serviceLines.push(
      '  POSTGRES_INITDB_ARGS: "--encoding=UTF8 --auth-host=scram-sha-256"',
    );
    serviceLines.push('  PGDATA: /var/lib/postgresql/18/docker');
    serviceLines.push('shm_size: 256mb');

    dotenvLines.push('POSTGRES_USER=postgres');
    dotenvLines.push('POSTGRES_PASSWORD=Example-only-Postgres-42!');
    dotenvLines.push('POSTGRES_DB=app');
    if (options.portMode === 'localhost') {
      dotenvLines.push(`POSTGRES_PORT=${hostPort}`);
    }

    commandLines.push('postgres');
    commandLines.push('-c');
    commandLines.push('listen_addresses=*');
    commandLines.push('-c');
    commandLines.push('timezone=Asia/Seoul');
  }

  if (options.presetId === 'redis') {
    if (options.configMount && preset.configMount?.redisCommand) {
      commandLines.push('redis-server');
      commandLines.push(preset.configMount.container);
    }
  }

  if (options.presetId === 'nginx') {
    // no required secrets
  }

  const volumeEntries: string[] = [];
  const topVolumes: string[] = [];

  if (options.persistMode === 'named') {
    const vol =
      options.namedVolumeName.trim() || preset.defaultNamedVolume;
    volumeEntries.push(`${vol}:${preset.dataContainerPath}`);
    topVolumes.push(`${vol}:`);
  } else if (options.persistMode === 'bind') {
    const host =
      options.bindDataPath.trim() || preset.defaultBindData;
    volumeEntries.push(`${host}:${preset.dataContainerPath}`);
  }

  if (options.configMount && preset.configMount) {
    volumeEntries.push(
      `${preset.configMount.host}:${preset.configMount.container}:ro`,
    );
  }

  if (
    (options.presetId === 'mysql' || options.presetId === 'mariadb') &&
    options.persistMode !== 'none'
  ) {
    const backupHost =
      options.presetId === 'mysql' ? './mysql/backup' : './mariadb/backup';
    volumeEntries.push(`${backupHost}:/backup`);
  }

  if (options.presetId === 'postgres' && options.persistMode !== 'none') {
    volumeEntries.push('./postgres/backup:/backup');
  }

  if (volumeEntries.length) {
    serviceLines.push('volumes:');
    for (const entry of volumeEntries) {
      serviceLines.push(`  - ${entry}`);
    }
  }

  if (commandLines.length) {
    serviceLines.push('command:');
    for (const item of commandLines) {
      serviceLines.push(`  - ${quoteIfNeeded(item)}`);
    }
  }

  if (options.healthcheck) {
    serviceLines.push('healthcheck:');
    if (options.presetId === 'mysql') {
      serviceLines.push('  test:');
      serviceLines.push('    - CMD-SHELL');
      serviceLines.push(
        '    - mysqladmin ping -h 127.0.0.1 --silent',
      );
    } else if (options.presetId === 'mariadb') {
      serviceLines.push(
        '  test: ["CMD", "healthcheck.sh", "--connect", "--innodb_initialized"]',
      );
    } else if (options.presetId === 'postgres') {
      serviceLines.push('  test:');
      serviceLines.push('    - CMD-SHELL');
      serviceLines.push(
        '    - pg_isready -h 127.0.0.1 -U "$${POSTGRES_USER}" -d "$${POSTGRES_DB}"',
      );
    } else if (options.presetId === 'redis') {
      serviceLines.push('  test: ["CMD", "redis-cli", "ping"]');
    } else if (options.presetId === 'nginx') {
      serviceLines.push('  test: ["CMD", "nginx", "-t"]');
    }
    serviceLines.push('  interval: 10s');
    serviceLines.push('  timeout: 5s');
    serviceLines.push('  retries: 10');
    serviceLines.push('  start_period: 30s');
  }

  const root: string[] = ['services:', `  ${service}:`];
  root.push(indentBlock(serviceLines, 2));

  if (options.networkMode === 'external') {
    const net =
      options.externalNetworkName.trim() || 'shared-network';
    root.push('');
    root.push('networks:');
    root.push(`  ${net}:`);
    root.push('    external: true');
  }

  if (topVolumes.length) {
    root.push('');
    root.push('volumes:');
    for (const vol of topVolumes) {
      root.push(`  ${vol}`);
    }
  }

  const composeYaml = `${root.join('\n')}\n`;
  const envExample = dotenvLines.length
    ? `${dotenvLines.join('\n')}\n`
    : null;

  return {composeYaml, envExample};
}

export function defaultOptionsForPreset(
  presetId: ComposePresetId,
): ComposeGeneratorOptions {
  const preset = COMPOSE_PRESETS[presetId];
  return {
    presetId,
    imageTag: preset.defaultImage,
    serviceName: preset.defaultServiceName,
    portMode: 'internal',
    hostPort: String(preset.defaultHostPort),
    networkMode: 'default',
    externalNetworkName: 'shared-network',
    persistMode: 'named',
    bindDataPath: preset.defaultBindData,
    namedVolumeName: preset.defaultNamedVolume,
    configMount: Boolean(preset.configMount),
    restart: true,
    healthcheck: true,
    serverId: presetId === 'mariadb' ? '11' : '1',
    enableBinlog: presetId === 'mysql' || presetId === 'mariadb',
    readOnly: false,
    superReadOnly: false,
  };
}
