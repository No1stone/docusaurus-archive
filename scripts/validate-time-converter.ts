import {
  convertTimeInput,
  formatEpochSeconds,
  hasExplicitTimezone,
  parseIso8601,
} from '../src/tools/utils/timeConverter';

function assert(cond: boolean, msg: string): void {
  if (!cond) {
    throw new Error(msg);
  }
}

function main(): void {
  const fromUtc = convertTimeInput(
    '2026-01-01T00:00:00.000Z',
    'iso8601',
    'utc',
  );
  assert(fromUtc.isoUtc === '2026-01-01T00:00:00.000Z', fromUtc.isoUtc);
  assert(
    fromUtc.isoKst === '2026-01-01T09:00:00.000+09:00',
    fromUtc.isoKst,
  );
  assert(fromUtc.epochSeconds === '1767225600', fromUtc.epochSeconds);
  assert(fromUtc.epochMillis === '1767225600000', fromUtc.epochMillis);

  const fromKst = convertTimeInput(
    '2026-01-01T09:00:00.000+09:00',
    'iso8601',
    'kst',
  );
  assert(fromKst.epochMillis === fromUtc.epochMillis, 'same epoch from KST ISO');
  assert(fromKst.isoUtc === fromUtc.isoUtc, 'same UTC');

  const fromMs = convertTimeInput('1767225600000', 'epoch-ms', 'utc');
  assert(fromMs.isoUtc === fromUtc.isoUtc, 'from ms');
  assert(fromMs.isoKst === fromUtc.isoKst, 'from ms kst');

  const fromS = convertTimeInput('1767225600', 'epoch-s', 'utc');
  assert(fromS.epochMillis === '1767225600000', 'from s');

  // fractional epoch seconds preserved
  const frac = convertTimeInput('1767225600.123', 'epoch-s', 'utc');
  assert(frac.epochMillis === '1767225600123', frac.epochMillis);
  assert(frac.epochSeconds === '1767225600.123', frac.epochSeconds);
  assert(formatEpochSeconds(1767225600123) === '1767225600.123', 'format frac');

  // naive ISO: UTC vs KST selection
  const naiveUtc = parseIso8601('2026-01-01T00:00:00.000', 'utc');
  const naiveKst = parseIso8601('2026-01-01T00:00:00.000', 'kst');
  assert(naiveUtc === 1767225600000, `naive utc ${naiveUtc}`);
  assert(naiveKst === 1767225600000 - 9 * 3600 * 1000, `naive kst ${naiveKst}`);
  assert(
    convertTimeInput('2026-01-01T00:00:00.000', 'iso8601', 'kst').isoUtc ===
      '2025-12-31T15:00:00.000Z',
    'naive kst → utc',
  );

  assert(hasExplicitTimezone('2026-01-01T00:00:00Z'), 'Z');
  assert(hasExplicitTimezone('2026-01-01T09:00:00+09:00'), '+09');
  assert(!hasExplicitTimezone('2026-01-01T00:00:00'), 'naive');

  let invalid = false;
  try {
    convertTimeInput('2026-02-30T00:00:00Z', 'iso8601', 'utc');
  } catch {
    invalid = true;
  }
  // Date.parse may roll Feb 30 — also test clear invalid naive
  try {
    convertTimeInput('2026-02-30T00:00:00', 'iso8601', 'utc');
    throw new Error('expected invalid date');
  } catch (e) {
    assert(
      e instanceof Error && e.message.includes('유효하지 않은'),
      String(e),
    );
  }

  try {
    convertTimeInput('not-a-date', 'iso8601', 'utc');
    throw new Error('expected parse error');
  } catch (e) {
    assert(e instanceof Error, 'error object');
  }

  void invalid;
  console.log('OK time converter');
}

main();
