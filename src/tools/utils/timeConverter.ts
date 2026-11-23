export type TimeInputFormat = 'epoch-s' | 'epoch-ms' | 'iso8601';

export type NaiveTimezone = 'utc' | 'kst';

export type TimeOutputs = {
  isoUtc: string;
  isoKst: string;
  epochSeconds: string;
  epochMillis: string;
};

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function pad3(n: number): string {
  return String(n).padStart(3, '0');
}

export function formatEpochSeconds(ms: number): string {
  const sign = ms < 0 ? '-' : '';
  const abs = Math.abs(Math.trunc(ms));
  const whole = Math.floor(abs / 1000);
  const rem = abs % 1000;
  if (rem === 0) {
    return `${sign}${whole}`;
  }
  return `${sign}${whole}.${pad3(rem)}`;
}

export function formatIsoUtc(ms: number): string {
  return new Date(ms).toISOString();
}

/** Same instant as UTC, written with fixed +09:00 (Korea, no DST). */
export function formatIsoKst(ms: number): string {
  const shifted = new Date(ms + KST_OFFSET_MS);
  return `${shifted.getUTCFullYear()}-${pad2(shifted.getUTCMonth() + 1)}-${pad2(shifted.getUTCDate())}T${pad2(shifted.getUTCHours())}:${pad2(shifted.getUTCMinutes())}:${pad2(shifted.getUTCSeconds())}.${pad3(shifted.getUTCMilliseconds())}+09:00`;
}

export function outputsFromEpochMs(ms: number): TimeOutputs {
  if (!Number.isFinite(ms)) {
    throw new Error('유효한 시각이 아닙니다.');
  }
  return {
    isoUtc: formatIsoUtc(ms),
    isoKst: formatIsoKst(ms),
    epochSeconds: formatEpochSeconds(ms),
    epochMillis: String(Math.trunc(ms)),
  };
}

export function parseEpochSeconds(input: string): number {
  const trimmed = input.trim();
  const negative = trimmed.startsWith('-');
  const body = negative ? trimmed.slice(1) : trimmed;
  const match = /^(\d+)(?:\.(\d+))?$/.exec(body);
  if (!match) {
    throw new Error('Epoch 초는 숫자여야 합니다.');
  }
  const whole = Number(match[1]);
  const fracRaw = match[2] ?? '';
  if (!Number.isSafeInteger(whole)) {
    throw new Error('Epoch 초 범위가 너무 큽니다.');
  }
  const frac = Number((fracRaw + '000').slice(0, 3));
  const ms = whole * 1000 + frac;
  return negative ? -ms : ms;
}

export function parseEpochMillis(input: string): number {
  const trimmed = input.trim();
  if (!/^-?\d+$/.test(trimmed)) {
    throw new Error('Epoch 밀리초는 정수여야 합니다.');
  }
  const ms = Number(trimmed);
  if (!Number.isSafeInteger(ms)) {
    throw new Error('Epoch 밀리초 범위가 너무 큽니다.');
  }
  return ms;
}

const NAIVE_LOCAL =
  /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?$/;

const HAS_EXPLICIT_ZONE = /(Z|[+-]\d{2}:?\d{2})$/i;

export function hasExplicitTimezone(input: string): boolean {
  return HAS_EXPLICIT_ZONE.test(input.trim());
}

function fromPartsUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  ms: number,
): number {
  const value = Date.UTC(year, month - 1, day, hour, minute, second, ms);
  const check = new Date(value);
  if (
    check.getUTCFullYear() !== year ||
    check.getUTCMonth() !== month - 1 ||
    check.getUTCDate() !== day ||
    check.getUTCHours() !== hour ||
    check.getUTCMinutes() !== minute ||
    check.getUTCSeconds() !== second
  ) {
    throw new Error('유효하지 않은 날짜입니다.');
  }
  return value;
}

export function parseIso8601(
  input: string,
  naiveTimezone: NaiveTimezone,
): number {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error('ISO 8601 값을 입력하세요.');
  }

  if (hasExplicitTimezone(trimmed)) {
    const ms = Date.parse(trimmed);
    if (!Number.isFinite(ms)) {
      throw new Error('유효하지 않은 ISO 8601 형식입니다.');
    }
    return ms;
  }

  const match = NAIVE_LOCAL.exec(trimmed);
  if (!match) {
    throw new Error(
      '시간대가 없는 값은 YYYY-MM-DDTHH:mm:ss[.sss] 형식이어야 하며, UTC 또는 KST를 선택하세요.',
    );
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const second = Number(match[6]);
  const ms = Number((match[7] ?? '0').padEnd(3, '0').slice(0, 3));

  const asUtc = fromPartsUtc(year, month, day, hour, minute, second, ms);
  if (naiveTimezone === 'utc') {
    return asUtc;
  }
  return asUtc - KST_OFFSET_MS;
}

export function parseTimeInput(
  input: string,
  format: TimeInputFormat,
  naiveTimezone: NaiveTimezone,
): number {
  switch (format) {
    case 'epoch-s':
      return parseEpochSeconds(input);
    case 'epoch-ms':
      return parseEpochMillis(input);
    case 'iso8601':
      return parseIso8601(input, naiveTimezone);
    default:
      throw new Error('알 수 없는 입력 형식입니다.');
  }
}

export function convertTimeInput(
  input: string,
  format: TimeInputFormat,
  naiveTimezone: NaiveTimezone,
): TimeOutputs {
  return outputsFromEpochMs(parseTimeInput(input, format, naiveTimezone));
}

export const TIME_CONVERTER_EXAMPLE = {
  format: 'iso8601' as TimeInputFormat,
  input: '2026-01-01T00:00:00.000Z',
  naiveTimezone: 'utc' as NaiveTimezone,
};
