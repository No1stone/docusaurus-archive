import {shellSingleQuote} from './shellQuote';

export type PermissionBits = {
  read: boolean;
  write: boolean;
  execute: boolean;
};

export type PermissionTriad = {
  owner: PermissionBits;
  group: PermissionBits;
  other: PermissionBits;
};

export type LinuxPermissionsState = {
  triad: PermissionTriad;
  /** Raw octal text from the input (may be invalid while typing). */
  octalInput: string;
  path: string;
};

const EMPTY_BITS: PermissionBits = {
  read: false,
  write: false,
  execute: false,
};

export function bitsToDigit(bits: PermissionBits): number {
  return (bits.read ? 4 : 0) + (bits.write ? 2 : 0) + (bits.execute ? 1 : 0);
}

export function digitToBits(digit: number): PermissionBits {
  return {
    read: (digit & 4) !== 0,
    write: (digit & 2) !== 0,
    execute: (digit & 1) !== 0,
  };
}

export function triadToOctal(triad: PermissionTriad): string {
  return `${bitsToDigit(triad.owner)}${bitsToDigit(triad.group)}${bitsToDigit(triad.other)}`;
}

export function bitsToSymbolic(bits: PermissionBits): string {
  return `${bits.read ? 'r' : '-'}${bits.write ? 'w' : '-'}${bits.execute ? 'x' : '-'}`;
}

export function triadToSymbolic(triad: PermissionTriad): string {
  return `${bitsToSymbolic(triad.owner)}${bitsToSymbolic(triad.group)}${bitsToSymbolic(triad.other)}`;
}

/** Valid three-digit octal mode 000–777. */
export function parseOctal(input: string): PermissionTriad | null {
  const trimmed = input.trim();
  if (!/^[0-7]{3}$/.test(trimmed)) {
    return null;
  }
  const [o, g, t] = trimmed.split('').map((c) => Number(c));
  return {
    owner: digitToBits(o),
    group: digitToBits(g),
    other: digitToBits(t),
  };
}

export function isValidOctal(input: string): boolean {
  return parseOctal(input) !== null;
}

export function buildChmodCommand(octal: string, path: string): string | null {
  if (!isValidOctal(octal)) {
    return null;
  }
  const trimmedPath = path.trim();
  if (!trimmedPath) {
    return null;
  }
  return `chmod ${octal.trim()} -- ${shellSingleQuote(trimmedPath)}`;
}

export function createEmptyTriad(): PermissionTriad {
  return {
    owner: {...EMPTY_BITS},
    group: {...EMPTY_BITS},
    other: {...EMPTY_BITS},
  };
}

export const LINUX_PERMISSIONS_DEFAULT: LinuxPermissionsState = {
  triad: createEmptyTriad(),
  octalInput: '000',
  path: '',
};

export const LINUX_PERMISSIONS_EXAMPLE: LinuxPermissionsState = {
  triad: parseOctal('640')!,
  octalInput: '640',
  path: './config/app settings.yml',
};
