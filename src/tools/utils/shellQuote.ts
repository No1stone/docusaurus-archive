/** POSIX sh / bash / zsh safe single-quoting. */
export function shellSingleQuote(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

/**
 * Env assignment for `KEY=value` command prefixes.
 * - bare `$NAME` / `${NAME}` → `KEY="$NAME"` (expands at runtime)
 * - already `"$NAME"` → keep as-is after KEY=
 * - otherwise single-quote so spaces/quotes stay literal
 */
export function shellEnvAssignment(key: string, value: string): string {
  const k = key.trim();
  if (!k) {
    return '';
  }
  const trimmed = value.trim();
  if (/^\$[A-Za-z_][A-Za-z0-9_]*$/.test(trimmed)) {
    return `${k}="${trimmed}"`;
  }
  if (/^\$\{[A-Za-z_][A-Za-z0-9_]*\}$/.test(trimmed)) {
    return `${k}="${trimmed}"`;
  }
  if (/^"\$\{?[A-Za-z_][A-Za-z0-9_]*\}?"$/.test(trimmed)) {
    return `${k}=${trimmed}`;
  }
  return `${k}=${shellSingleQuote(value)}`;
}

export function formatEnvPrefix(
  entries: Array<{key: string; value: string}>,
): string {
  return entries
    .map((e) => shellEnvAssignment(e.key, e.value))
    .filter(Boolean)
    .join(' ');
}
