import {
  JAR_COMMAND_DEFAULT,
  JAR_COMMAND_EXAMPLE,
  buildGradleCommand,
  buildJarRunCommand,
  buildPreviewCommand,
  createEnvRow,
  createProp,
  suggestJarPath,
  type JarCommandState,
} from '../src/tools/utils/jarCommandGenerator';

function assert(cond: boolean, msg: string): void {
  if (!cond) {
    throw new Error(msg);
  }
}

function main(): void {
  assert(
    suggestJarPath('api-auth', 'bootJar') === 'api-auth/build/libs/api-auth.jar',
    'suggest multi',
  );

  const multi: JarCommandState = {
    ...JAR_COMMAND_EXAMPLE,
    env: [
      createEnvRow('BUILD_ONLY', '1', 'build'),
      createEnvRow('RUN_ONLY', '2', 'run'),
      createEnvRow('DB_PASSWORD', '$DB_PASSWORD', 'both'),
    ],
    springProfile: 'local',
    serverPort: '8080',
  };

  const buildCmd = buildGradleCommand(multi);
  assert(buildCmd.includes('BUILD_ONLY='), `build has BUILD_ONLY: ${buildCmd}`);
  assert(!buildCmd.includes('RUN_ONLY='), `build no RUN_ONLY: ${buildCmd}`);
  assert(buildCmd.includes('DB_PASSWORD="$DB_PASSWORD"'), 'build both env');
  assert(
    buildCmd.includes('./gradlew clean :api-auth:bootJar'),
    `gradle task: ${buildCmd}`,
  );

  const runCmd = buildJarRunCommand(multi);
  assert(!runCmd.includes('BUILD_ONLY='), `run no BUILD_ONLY: ${runCmd}`);
  assert(runCmd.includes('RUN_ONLY='), `run has RUN_ONLY: ${runCmd}`);
  assert(runCmd.includes('DB_PASSWORD="$DB_PASSWORD"'), 'run both env');
  assert(runCmd.includes('--spring.profiles.active=local'), 'profile arg');
  assert(runCmd.includes('--server.port=8080'), 'port arg');
  assert(
    runCmd.indexOf('-Xms64m') < runCmd.indexOf(' -jar ') &&
      runCmd.indexOf('-Dfile.encoding') < runCmd.indexOf(' -jar ') &&
      runCmd.indexOf('--spring.profiles.active') > runCmd.indexOf(' -jar '),
    `jvm order: ${runCmd}`,
  );

  // Dedup: SPRING_PROFILES_ACTIVE env suppresses CLI profile arg
  const dedup = buildJarRunCommand({
    ...multi,
    env: [createEnvRow('SPRING_PROFILES_ACTIVE', 'local', 'run')],
    springProfile: 'local',
    serverPort: '8080',
  });
  assert(
    !dedup.includes('--spring.profiles.active='),
    `dedup profile: ${dedup}`,
  );
  assert(dedup.includes('--server.port=8080'), 'port still present');

  const and = buildPreviewCommand({...multi, outputMode: 'build-and-run'});
  assert(and.includes(' && '), `&& join: ${and}`);
  assert(and.startsWith(buildCmd), 'build first');
  assert(and.endsWith(runCmd), 'run second');
  // Shell semantics: left of && must succeed for right to run
  assert(
    and === `${buildCmd} && ${runCmd}`,
    'exact && composition for short-circuit',
  );

  const buildOnly = buildPreviewCommand({...multi, outputMode: 'build-only'});
  assert(buildOnly === buildCmd && !buildOnly.includes('java '), 'build-only');

  const runOnly = buildPreviewCommand({...multi, outputMode: 'run-only'});
  assert(runOnly === runCmd && !runOnly.includes('./gradlew'), 'run-only');

  const spaced = buildJarRunCommand({
    ...JAR_COMMAND_DEFAULT,
    jarPath: 'build/libs/my app.jar',
    xms: '64m',
    xmx: '512m',
    systemProps: [createProp('a', 'b c')],
    springProfile: '',
    serverPort: '',
    env: [createEnvRow('MSG', 'hello world', 'run')],
  });
  assert(spaced.includes(" -jar 'build/libs/my app.jar'"), `quote jar: ${spaced}`);
  assert(spaced.includes("MSG='hello world'"), `quote env: ${spaced}`);

  console.log('OK jar command generator modes/env/&&');
}

main();
