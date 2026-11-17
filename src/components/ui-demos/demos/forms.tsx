import {useEffect, useId, useMemo, useRef, useState, type ReactNode} from 'react';

import {demoShellProps} from '../catalog';
import DemoShell from '../DemoShell';
import {CITIES, PEOPLE, wait} from '../sampleData';
import styles from '../styles.module.css';


export function RequiredHintDemo(): ReactNode {
  return (
    <DemoShell {...demoShellProps('required-hint')}>
      <div style={{padding: '0.75rem'}} className={styles.stack}>
        <label>
          이메일 <span className={styles.danger}>*</span>
          <input className={styles.input} required aria-required="true" placeholder="name@example.com" />
        </label>
        <span className={styles.hint}>* 표시는 필수 항목입니다.</span>
      </div>
    </DemoShell>
  );
}

export function InlineValidationDemo(): ReactNode {
  const [email, setEmail] = useState('');
  const valid = email === '' || email.includes('@');
  return (
    <DemoShell {...demoShellProps('inline-validation')} onReset={() => setEmail('')}>
      <div style={{padding: '0.75rem'}} className={styles.stack}>
        <label>
          이메일
          <input
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!valid}
          />
        </label>
        {!valid ? <span className={styles.danger} role="alert">올바른 이메일 형식이 필요합니다.</span> : null}
      </div>
    </DemoShell>
  );
}

export function ErrorSummaryDemo(): ReactNode {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  return (
    <DemoShell {...demoShellProps('error-summary')} onReset={() => { setErrors([]); setName(''); setEmail(''); }}>
      <form
        style={{padding: '0.75rem'}}
        className={styles.stack}
        onSubmit={(e) => {
          e.preventDefault();
          const next: string[] = [];
          if (!name.trim()) next.push('이름을 입력하세요.');
          if (!email.includes('@')) next.push('이메일을 확인하세요.');
          setErrors(next);
          if (next.length) {
            (name.trim() ? emailRef : nameRef).current?.focus();
          }
        }}>
        {errors.length ? (
          <div className={styles.card} role="alert">
            <strong>오류 요약</strong>
            <ul>{errors.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
        ) : null}
        <input ref={nameRef} className={styles.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="이름" />
        <input ref={emailRef} className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일" />
        <button type="submit" className={styles.btnPrimary}>제출</button>
      </form>
    </DemoShell>
  );
}

export function PasswordRevealDemo(): ReactNode {
  const [show, setShow] = useState(false);
  const [value, setValue] = useState('secret');
  return (
    <DemoShell {...demoShellProps('password-reveal')} onReset={() => { setShow(false); setValue('secret'); }}>
      <div className={styles.row} style={{padding: '0.75rem'}}>
        <input className={styles.input} type={show ? 'text' : 'password'} value={value} onChange={(e) => setValue(e.target.value)} />
        <button type="button" className={styles.btn} onClick={() => setShow((v) => !v)}>{show ? '숨기기' : '보기'}</button>
      </div>
    </DemoShell>
  );
}

export function OtpDemo(): ReactNode {
  const [digits, setDigits] = useState(['', '', '', '']);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  return (
    <DemoShell {...demoShellProps('otp-input')} onReset={() => setDigits(['', '', '', ''])}>
      <div className={styles.row} style={{padding: '0.75rem'}}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            className={styles.input}
            style={{width: 48, textAlign: 'center'}}
            inputMode="numeric"
            maxLength={1}
            value={d}
            aria-label={`인증 코드 ${i + 1}`}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, '').slice(-1);
              const next = [...digits];
              next[i] = v;
              setDigits(next);
              if (v && i < 3) refs.current[i + 1]?.focus();
            }}
          />
        ))}
      </div>
    </DemoShell>
  );
}

export function DynamicRowsDemo(): ReactNode {
  const [rows, setRows] = useState(['항목 1']);
  return (
    <DemoShell {...demoShellProps('dynamic-rows')} onReset={() => setRows(['항목 1'])}>
      <div style={{padding: '0.75rem'}} className={styles.stack}>
        {rows.map((row, i) => (
          <div key={i} className={styles.row}>
            <input
              className={styles.input}
              value={row}
              onChange={(e) => setRows((r) => r.map((x, idx) => (idx === i ? e.target.value : x)))}
            />
            <button type="button" className={styles.btn} onClick={() => setRows((r) => r.filter((_, idx) => idx !== i))} disabled={rows.length === 1}>
              삭제
            </button>
          </div>
        ))}
        <button type="button" className={styles.btnPrimary} onClick={() => setRows((r) => [...r, `항목 ${r.length + 1}`])}>행 추가</button>
      </div>
    </DemoShell>
  );
}

export function MultiStepFormDemo(): ReactNode {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [city, setCity] = useState(CITIES[0]);
  return (
    <DemoShell {...demoShellProps('multi-step-form')} onReset={() => { setStep(0); setName(''); setCity(CITIES[0]); }}>
      <div style={{padding: '0.75rem'}} className={styles.stack}>
        <span className={styles.hint}>단계 {step + 1}/3</span>
        {step === 0 ? <input className={styles.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="이름" /> : null}
        {step === 1 ? (
          <select className={styles.input} value={city} onChange={(e) => setCity(e.target.value)}>
            {CITIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        ) : null}
        {step === 2 ? <div className={styles.card}>{name || '(이름 없음)'} · {city}</div> : null}
        <div className={styles.row}>
          <button type="button" className={styles.btn} disabled={step === 0} onClick={() => setStep((s) => s - 1)}>이전</button>
          <button type="button" className={styles.btnPrimary} disabled={step === 2} onClick={() => setStep((s) => s + 1)}>다음</button>
        </div>
      </div>
    </DemoShell>
  );
}

export function SaveResultDemo(): ReactNode {
  const [state, setState] = useState<'idle' | 'pressed' | 'loading' | 'success' | 'error'>('idle');
  return (
    <DemoShell {...demoShellProps('save-result')}
      controls={
        <label>
          실패 시나리오
          <input type="checkbox" id="fail-save" />
        </label>
      }
      onReset={() => setState('idle')}
    >
      <div style={{padding: '0.75rem'}} className={styles.stack}>
        <button
          type="button"
          className={styles.btnPrimary}
          disabled={state === 'loading' || state === 'pressed'}
          onClick={async () => {
            const fail = (document.getElementById('fail-save') as HTMLInputElement | null)?.checked;
            setState('pressed');
            await wait(120);
            setState('loading');
            await wait(700);
            setState(fail ? 'error' : 'success');
          }}>
          {state === 'loading' || state === 'pressed' ? '저장 중…' : '저장'}
        </button>
        {state === 'success' ? <span className={styles.ok}>저장되었습니다.</span> : null}
        {state === 'error' ? <span className={styles.danger}>저장에 실패했습니다. (모의)</span> : null}
        {state !== 'idle' ? <span className={styles.hint}>상태: {state}</span> : null}
      </div>
    </DemoShell>
  );
}

export function UnsavedLeaveDemo(): ReactNode {
  const [value, setValue] = useState('초안');
  const [dirty, setDirty] = useState(false);
  const [msg, setMsg] = useState('');
  return (
    <DemoShell {...demoShellProps('unsaved-leave')} onReset={() => { setValue('초안'); setDirty(false); setMsg(''); }}>
      <div style={{padding: '0.75rem'}} className={styles.stack}>
        <textarea
          className={styles.input}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setDirty(true);
          }}
        />
        <button
          type="button"
          className={styles.btn}
          onClick={() => {
            if (dirty && !window.confirm('저장하지 않은 변경이 있습니다. 나가시겠습니까?')) return;
            setMsg('페이지를 떠난 것으로 처리했습니다. (모의)');
            setDirty(false);
          }}>
          나가기
        </button>
        {msg ? <span className={styles.hint}>{msg}</span> : null}
      </div>
    </DemoShell>
  );
}
