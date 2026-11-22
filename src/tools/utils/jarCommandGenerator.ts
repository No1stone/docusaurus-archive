import {formatEnvPrefix, shellSingleQuote} from './shellQuote';

export type EnvScope = 'build' | 'run' | 'both';

export type EnvRow = {
  id: string;
  key: string;
  value: string;
  scope: EnvScope;
};

export type GradleTask = 'bootJar' | 'jar';

export type OutputMode = 'build-and-run' | 'build-only' | 'run-only';

export type JvmSystemProp = {id: string; key: string; value: string};

export type JarCommandState = {
  outputMode: OutputMode;
  modulePath: string;
  task: GradleTask;
  clean: boolean;
  runTests: boolean;
  extraGradleOptions: string;
  jarPath: string;
  jarPathTouched: boolean;
  xms: string;
  xmx: string;
  systemProps: JvmSystemProp[];
  springProfile: string;
  serverPort: string;
  env: EnvRow[];
};

function gradleProjectPrefix(modulePath: string): string {
  const raw = modulePath.trim().replace(/^:+/, '').replace(/\/+/g, ':');
  if (!raw) {
    return '';
  }
  return `:${raw}:`;
}

/** Suggest default JAR path from module; user can edit freely. */
export function suggestJarPath(modulePath: string, _task: GradleTask): string {
  const raw = modulePath.trim().replace(/^:+/, '').replace(/:/g, '/');
  if (!raw) {
    return 'build/libs/app.jar';
  }
  const leaf = raw.split('/').filter(Boolean).pop() ?? 'app';
  // multi-module: api-auth → api-auth/build/libs/api-auth.jar
  return `${leaf}/build/libs/${leaf}.jar`;
}

export function filterEnv(
  env: EnvRow[],
  target: 'build' | 'run',
): Array<{key: string; value: string}> {
  return env
    .filter((row) => {
      if (!row.key.trim()) {
        return false;
      }
      if (row.scope === 'both') {
        return true;
      }
      return row.scope === target;
    })
    .map(({key, value}) => ({key, value}));
}

/**
 * Avoid duplicating Spring profile/port when the same keys appear as env
 * and as CLI args — prefer the dedicated run fields as app args only when
 * env does not already set them for the run command.
 */
export function shouldEmitSpringProfileArg(
  profile: string,
  runEnv: Array<{key: string; value: string}>,
): boolean {
  if (!profile.trim()) {
    return false;
  }
  return !runEnv.some(
    (e) => e.key.trim().toUpperCase() === 'SPRING_PROFILES_ACTIVE',
  );
}

export function shouldEmitServerPortArg(
  port: string,
  runEnv: Array<{key: string; value: string}>,
): boolean {
  if (!port.trim()) {
    return false;
  }
  return !runEnv.some((e) => e.key.trim().toUpperCase() === 'SERVER_PORT');
}

export function buildGradleCommand(state: JarCommandState): string {
  const parts: string[] = [];
  const env = formatEnvPrefix(filterEnv(state.env, 'build'));
  if (env) {
    parts.push(env);
  }
  parts.push('./gradlew');
  if (state.clean) {
    parts.push('clean');
  }
  if (state.runTests) {
    parts.push('test');
  }
  const prefix = gradleProjectPrefix(state.modulePath);
  parts.push(`${prefix}${state.task}`);
  const extra = state.extraGradleOptions.trim();
  if (extra) {
    parts.push(extra);
  }
  return parts.join(' ');
}

export function buildJarRunCommand(state: JarCommandState): string {
  const parts: string[] = [];
  const runEnv = filterEnv(state.env, 'run');
  const env = formatEnvPrefix(runEnv);
  if (env) {
    parts.push(env);
  }
  parts.push('java');
  const xms = state.xms.trim();
  const xmx = state.xmx.trim();
  if (xms) {
    parts.push(xms.startsWith('-Xms') ? xms : `-Xms${xms}`);
  }
  if (xmx) {
    parts.push(xmx.startsWith('-Xmx') ? xmx : `-Xmx${xmx}`);
  }
  for (const prop of state.systemProps) {
    const key = prop.key.trim();
    if (!key) {
      continue;
    }
    const arg = `-D${key}=${prop.value}`;
    parts.push(/[\s'"\\$`]/.test(arg) ? shellSingleQuote(arg) : arg);
  }
  parts.push('-jar');
  parts.push(shellSingleQuote(state.jarPath.trim() || 'app.jar'));
  if (shouldEmitSpringProfileArg(state.springProfile, runEnv)) {
    parts.push(`--spring.profiles.active=${state.springProfile.trim()}`);
  }
  if (shouldEmitServerPortArg(state.serverPort, runEnv)) {
    parts.push(`--server.port=${state.serverPort.trim()}`);
  }
  return parts.join(' ');
}

/** Uses && so a failed build never starts the run command. */
export function buildPreviewCommand(state: JarCommandState): string {
  if (state.outputMode === 'build-only') {
    return buildGradleCommand(state);
  }
  if (state.outputMode === 'run-only') {
    return buildJarRunCommand(state);
  }
  return `${buildGradleCommand(state)} && ${buildJarRunCommand(state)}`;
}

export function createEnvRow(
  key = '',
  value = '',
  scope: EnvScope = 'run',
): EnvRow {
  return {
    id: `env-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    key,
    value,
    scope,
  };
}

export function createProp(
  key = '',
  value = '',
): JvmSystemProp {
  return {
    id: `prop-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    key,
    value,
  };
}

export const JAR_COMMAND_DEFAULT: JarCommandState = {
  outputMode: 'build-and-run',
  modulePath: '',
  task: 'bootJar',
  clean: false,
  runTests: false,
  extraGradleOptions: '',
  jarPath: 'build/libs/app.jar',
  jarPathTouched: false,
  xms: '64m',
  xmx: '512m',
  systemProps: [],
  springProfile: '',
  serverPort: '',
  env: [],
};

export const JAR_COMMAND_EXAMPLE: JarCommandState = {
  outputMode: 'build-and-run',
  modulePath: 'api-auth',
  task: 'bootJar',
  clean: true,
  runTests: false,
  extraGradleOptions: '',
  jarPath: 'api-auth/build/libs/api-auth.jar',
  jarPathTouched: true,
  xms: '64m',
  xmx: '512m',
  systemProps: [createProp('file.encoding', 'UTF-8')],
  springProfile: 'local',
  serverPort: '8080',
  env: [createEnvRow('DB_PASSWORD', '$DB_PASSWORD', 'both')],
};
