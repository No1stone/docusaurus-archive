export type ComposePresetId =
  | 'mysql'
  | 'mariadb'
  | 'postgres'
  | 'redis'
  | 'nginx';

export type ComposePreset = {
  id: ComposePresetId;
  label: string;
  defaultServiceName: string;
  defaultImage: string;
  containerPort: number;
  defaultHostPort: number;
  dataContainerPath: string;
  defaultBindData: string;
  defaultNamedVolume: string;
  configMount?: {
    host: string;
    container: string;
    /** When set, also set command to use this config. */
    redisCommand?: boolean;
  };
  docPath: string;
  docLabel: string;
  supportsDbExtras: 'mysql' | 'mariadb' | false;
};

/** Values aligned with Knowledge Compose examples in this archive. */
export const COMPOSE_PRESETS: Record<ComposePresetId, ComposePreset> = {
  mysql: {
    id: 'mysql',
    label: 'MySQL 8.4',
    defaultServiceName: 'mysql',
    defaultImage: 'mysql:8.4',
    containerPort: 3306,
    defaultHostPort: 3306,
    dataContainerPath: '/var/lib/mysql',
    defaultBindData: './mysql/data',
    defaultNamedVolume: 'mysql-data',
    configMount: {
      host: './mysql/conf',
      container: '/etc/mysql/conf.d',
    },
    docPath: '/docs/knowledge/data/mysql/operations/docker-compose-examples',
    docLabel: 'MySQL·MariaDB Compose 예제',
    supportsDbExtras: 'mysql',
  },
  mariadb: {
    id: 'mariadb',
    label: 'MariaDB 11.4',
    defaultServiceName: 'mariadb',
    defaultImage: 'mariadb:11.4',
    containerPort: 3306,
    defaultHostPort: 3307,
    dataContainerPath: '/var/lib/mysql',
    defaultBindData: './mariadb/data',
    defaultNamedVolume: 'mariadb-data',
    configMount: {
      host: './mariadb/conf',
      container: '/etc/mysql/conf.d',
    },
    docPath: '/docs/knowledge/data/mysql/operations/docker-compose-examples',
    docLabel: 'MySQL·MariaDB Compose 예제',
    supportsDbExtras: 'mariadb',
  },
  postgres: {
    id: 'postgres',
    label: 'PostgreSQL 18',
    defaultServiceName: 'postgres',
    defaultImage: 'postgres:18',
    containerPort: 5432,
    defaultHostPort: 5432,
    dataContainerPath: '/var/lib/postgresql',
    defaultBindData: './postgres/data',
    defaultNamedVolume: 'postgres-data',
    configMount: {
      host: './postgres/conf',
      container: '/etc/postgresql',
    },
    docPath: '/docs/knowledge/data/postgresql/docker-compose-examples',
    docLabel: 'PostgreSQL Compose 예제',
    supportsDbExtras: false,
  },
  redis: {
    id: 'redis',
    label: 'Redis 7',
    defaultServiceName: 'redis',
    defaultImage: 'redis:7',
    containerPort: 6379,
    defaultHostPort: 6379,
    dataContainerPath: '/data',
    defaultBindData: './redis/data',
    defaultNamedVolume: 'redis-data',
    configMount: {
      host: './redis/redis.conf',
      container: '/usr/local/etc/redis/redis.conf',
      redisCommand: true,
    },
    docPath: '/docs/knowledge/data/redis/ops/topology',
    docLabel: 'Redis 토폴로지',
    supportsDbExtras: false,
  },
  nginx: {
    id: 'nginx',
    label: 'Nginx',
    defaultServiceName: 'nginx',
    defaultImage: 'nginx:1.27',
    containerPort: 80,
    defaultHostPort: 8080,
    dataContainerPath: '/usr/share/nginx/html',
    defaultBindData: './nginx/html',
    defaultNamedVolume: 'nginx-html',
    configMount: {
      host: './nginx/conf.d',
      container: '/etc/nginx/conf.d',
    },
    docPath: '/docs/knowledge/k-docker-compose',
    docLabel: 'Docker Compose 메모',
    supportsDbExtras: false,
  },
};

export const COMPOSE_PRESET_LIST = Object.values(COMPOSE_PRESETS);
