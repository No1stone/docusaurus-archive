import {
  bitsToDigit,
  buildChmodCommand,
  parseOctal,
  triadToOctal,
  triadToSymbolic,
} from '../src/tools/utils/linuxPermissions';

function assert(cond: boolean, msg: string): void {
  if (!cond) {
    throw new Error(msg);
  }
}

function main(): void {
  const m640 = parseOctal('640');
  assert(m640 !== null, '640 parse');
  assert(triadToOctal(m640!) === '640', '640 octal');
  assert(triadToSymbolic(m640!) === 'rw-r-----', `640 symbolic: ${triadToSymbolic(m640!)}`);
  assert(bitsToDigit(m640!.owner) === 6, 'owner 6');
  assert(bitsToDigit(m640!.group) === 4, 'group 4');
  assert(bitsToDigit(m640!.other) === 0, 'other 0');

  const m755 = parseOctal('755')!;
  assert(triadToSymbolic(m755) === 'rwxr-xr-x', `755: ${triadToSymbolic(m755)}`);

  const m000 = parseOctal('000')!;
  assert(triadToSymbolic(m000) === '---------', `000: ${triadToSymbolic(m000)}`);
  assert(triadToOctal(m000) === '000', '000 octal');

  assert(parseOctal('888') === null, 'invalid 888');
  assert(parseOctal('64') === null, 'incomplete');
  assert(parseOctal('0755') === null, 'four digits rejected');

  const spaced = buildChmodCommand(
    '640',
    './config/app settings.yml',
  );
  assert(
    spaced === "chmod 640 -- './config/app settings.yml'",
    `spaced: ${spaced}`,
  );

  const quoted = buildChmodCommand('755', "dir/it's file.txt");
  assert(
    quoted === "chmod 755 -- 'dir/it'\\''s file.txt'",
    `quote in path: ${quoted}`,
  );

  assert(buildChmodCommand('640', '') === null, 'empty path');
  assert(buildChmodCommand('640', '   ') === null, 'blank path');
  assert(buildChmodCommand('64a', './a') === null, 'invalid mode');
  assert(buildChmodCommand('000', './secret') === "chmod 000 -- './secret'", '000 ok');

  console.log('OK linux permissions');
}

main();
