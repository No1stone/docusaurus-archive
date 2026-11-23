import {useState, type ReactNode} from 'react';

import CopyButton from '../components/CopyButton';
import ToolShell from '../components/ToolShell';
import styles from '../styles.module.css';

function tokenize(command: string): string[] {
  const tokens: string[] = [];
  let current = '';
  let quote: "'" | '"' | null = null;
  for (let i = 0; i < command.length; i += 1) {
    const ch = command[i]!;
    if (quote) {
      if (ch === quote) {
        quote = null;
      } else {
        current += ch;
      }
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      continue;
    }
    if (/\s/.test(ch)) {
      if (current) {
        tokens.push(current);
        current = '';
      }
      continue;
    }
    current += ch;
  }
  if (current) {
    tokens.push(current);
  }
  return tokens;
}

function parseDockerRun(input: string): {yaml: string; notes: string[]} {
  const notes: string[] = [
    '단순 docker run 플래그(-p, -e, -v, --name, -d)만 변환합니다.',
    '네트워크, restart, user, cap, entrypoint 등은 수동 보완이 필요할 수 있습니다.',
  ];
  const trimmed = input.trim().replace(/\\\s*\n/g, ' ');
  if (!trimmed) {
    return {yaml: '', notes: ['docker run 명령을 입력하세요.']};
  }
  const tokens = tokenize(trimmed);
  if (tokens[0] !== 'docker' || tokens[1] !== 'run') {
    return {yaml: '', notes: ['docker run 으로 시작하는 명령만 지원합니다.']};
  }

  let image = '';
  const ports: string[] = [];
  const env: string[] = [];
  const volumes: string[] = [];
  let name = 'app';
  let detach = false;

  for (let i = 2; i < tokens.length; i += 1) {
    const t = tokens[i]!;
    if (t === '-d' || t === '--detach') {
      detach = true;
      continue;
    }
    if (t === '-p' || t === '--publish') {
      const val = tokens[++i];
      if (val) {
        ports.push(val);
      }
      continue;
    }
    if (t === '-e' || t === '--env') {
      const val = tokens[++i];
      if (val) {
        env.push(val);
      }
      continue;
    }
    if (t === '-v' || t === '--volume') {
      const val = tokens[++i];
      if (val) {
        volumes.push(val);
      }
      continue;
    }
    if (t === '--name') {
      const val = tokens[++i];
      if (val) {
        name = val;
      }
      continue;
    }
    if (!t.startsWith('-')) {
      image = t;
    }
  }

  if (!image) {
    return {yaml: '', notes: ['이미지 이름을 찾지 못했습니다.']};
  }

  const envLines = env.map((e) => `      - ${e}`).join('\n');
  const volLines = volumes.map((v) => `      - ${v}`).join('\n');

  const yaml = `services:
  ${name}:
    image: ${image}
    container_name: ${name}${
      ports.length ? `\n    ports:\n${ports.map((p) => `      - "${p}"`).join('\n')}` : ''
    }${env.length ? `\n    environment:\n${envLines}` : ''}${volumes.length ? `\n    volumes:\n${volLines}` : ''}
`;

  if (detach) {
    notes.push('Compose에서는 detach 대신 docker compose up -d 로 기동합니다.');
  }

  return {yaml, notes};
}

export default function DockerRunToCompose(): ReactNode {
  const [command, setCommand] = useState(
    'docker run -d --name web -p 8080:80 -e NODE_ENV=production -v ./data:/data nginx:alpine',
  );
  const [yaml, setYaml] = useState('');
  const [notes, setNotes] = useState<string[]>([]);
  const [error, setError] = useState('');

  const convert = () => {
    const {yaml: nextYaml, notes: nextNotes} = parseDockerRun(command);
    if (!nextYaml) {
      setError(nextNotes[0] ?? '변환에 실패했습니다.');
      setYaml('');
      setNotes(nextNotes);
      return;
    }
    setYaml(nextYaml);
    setNotes(nextNotes);
    setError('');
  };

  const reset = () => {
    setCommand('');
    setYaml('');
    setNotes([]);
    setError('');
  };

  return (
    <ToolShell
      title="docker run → Compose"
      summary="간단한 docker run 한 줄을 docker-compose.yml 조각으로 바꿉니다."
      controls={
        <div className={styles.field}>
          <label htmlFor="docker-cmd">docker run 명령</label>
          <textarea
            id="docker-cmd"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            spellCheck={false}
            rows={4}
          />
        </div>
      }
      actions={
        <>
          <button type="button" className={styles.primaryButton} onClick={convert}>
            변환
          </button>
          <button type="button" className={styles.secondaryButton} onClick={reset}>
            초기화
          </button>
        </>
      }
      result={
        <>
          {error ? <p className={styles.error}>{error}</p> : null}
          {notes.length > 0 ? (
            <ul className={styles.hint}>
              {notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          ) : null}
          <textarea
            readOnly
            value={yaml}
            spellCheck={false}
            placeholder="변환된 compose 스니펫"
            style={{minHeight: '10rem'}}
          />
          <div style={{marginTop: '0.75rem'}}>
            <CopyButton text={yaml} label="YAML 복사" />
          </div>
        </>
      }
      example={
        <p>
          문서에 남은 run 예제를 Compose로 옮길 때 초안을 빠르게 잡습니다.
          프로덕션 설정은 반드시 한 번 더 검토하세요.
        </p>
      }
    />
  );
}