#!/usr/bin/env bash
# Pop 1~5 article paths from scripts/doc-push-queue.txt, commit each, build, push.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

QUEUE_FILE="${QUEUE_FILE:-$REPO_ROOT/scripts/doc-push-queue.txt}"
LOG_FILE="${LOG_FILE:-/tmp/origemite-push-docs-batch.log}"
DRY_RUN="${DRY_RUN:-0}"
BATCH_MIN="${BATCH_MIN:-1}"
BATCH_MAX="${BATCH_MAX:-5}"
BATCH_SIZE="${BATCH_SIZE:-3}"

log() {
  local msg="[$(date '+%Y-%m-%d %H:%M:%S')] $*"
  echo "$msg" | tee -a "$LOG_FILE"
}

clamp_batch() {
  local n="$BATCH_SIZE"
  if [[ "$n" -lt "$BATCH_MIN" ]]; then n="$BATCH_MIN"; fi
  if [[ "$n" -gt "$BATCH_MAX" ]]; then n="$BATCH_MAX"; fi
  echo "$n"
}

commit_message_for() {
  local path="$1"
  local title=""
  if [[ -f "$path" && "$path" == *.md ]]; then
    title="$(grep -E '^title:' "$path" 2>/dev/null | head -n1 | sed 's/^title:[[:space:]]*//; s/^["'\'']//; s/["'\'']$//')" || true
  fi
  if [[ -z "${title:-}" ]]; then
    title="$(basename "$path")"
  fi
  if [[ ! -e "$path" ]]; then
    echo "[archive][docs]: ${title} 경로를 정리한다"
  else
    echo "[archive][docs]: ${title}"
  fi
}

add_with_categories() {
  local path="$1"
  git add -A -- "$path" || true
  local d
  d="$(dirname "$path")"
  local i
  for i in 1 2 3 4; do
    local cat="$d/_category_.json"
    if [[ -e "$cat" ]] || git ls-files --error-unmatch "$cat" >/dev/null 2>&1; then
      if git status --porcelain -u -- "$cat" 2>/dev/null | grep -q .; then
        git add -A -- "$cat" || true
      fi
    elif [[ -f "$cat" ]]; then
      git add -A -- "$cat" || true
    fi
    [[ "$d" == "." || "$d" == "/" || "$d" == "docs" ]] && break
    d="$(dirname "$d")"
  done
}

if [[ ! -f "$QUEUE_FILE" ]]; then
  log "queue missing: $QUEUE_FILE"
  exit 0
fi

QUEUE=()
while IFS= read -r line || [[ -n "${line:-}" ]]; do
  [[ -z "${line//[[:space:]]/}" || "$line" == \#* ]] && continue
  QUEUE+=("$line")
done < "$QUEUE_FILE"

if [[ ${#QUEUE[@]} -eq 0 ]]; then
  log "queue empty; nothing to do"
  exit 0
fi

N="$(clamp_batch)"
if [[ "$N" -gt ${#QUEUE[@]} ]]; then
  N=${#QUEUE[@]}
fi

BATCH=()
REST=()
i=0
for path in "${QUEUE[@]}"; do
  if [[ "$i" -lt "$N" ]]; then
    BATCH+=("$path")
  else
    REST+=("$path")
  fi
  i=$((i + 1))
done

log "batch=$N dry_run=$DRY_RUN repo=$REPO_ROOT"
for p in "${BATCH[@]}"; do
  log "  - $p"
done

if [[ "$DRY_RUN" == "1" ]]; then
  log "dry-run only; exit"
  exit 0
fi

# HTTPS push uses `gh auth git-credential` + active account (not cwd alone).
GH_PUSH_USER="${GH_PUSH_USER:-No1stone}"
if ! command -v gh >/dev/null 2>&1; then
  log "ERROR: gh CLI not found; cannot switch push account"
  exit 1
fi
if ! gh auth switch --user "$GH_PUSH_USER" >>"$LOG_FILE" 2>&1; then
  log "ERROR: gh auth switch --user $GH_PUSH_USER failed"
  exit 1
fi
log "gh push user: $GH_PUSH_USER"

git fetch origin >>"$LOG_FILE" 2>&1 || true

if ! git merge-base --is-ancestor origin/main HEAD 2>/dev/null; then
  log "ERROR: HEAD is not a descendant of origin/main; abort"
  exit 1
fi

committed=0
for path in "${BATCH[@]}"; do
  add_with_categories "$path"
  if git diff --cached --quiet; then
    log "skip (nothing staged): $path"
    continue
  fi
  msg="$(commit_message_for "$path")"
  git commit -m "$msg"
  committed=$((committed + 1))
  log "committed: $msg"
done

# Persist remaining queue (and stage queue file into last commit if we created commits)
if [[ ${#REST[@]} -eq 0 ]]; then
  : > "$QUEUE_FILE"
else
  printf '%s\n' "${REST[@]}" > "$QUEUE_FILE"
fi

# Always persist dequeue (including all-skip), so stuck paths do not block forever.
git add -- "$QUEUE_FILE"
if ! git diff --cached --quiet -- "$QUEUE_FILE"; then
  git commit -m "[archive][chore]: doc-push 큐를 갱신한다"
  log "committed queue update"
fi

if [[ "$committed" -eq 0 ]]; then
  log "no content commits; pushing queue advance only"
  if ! git push origin HEAD >>"$LOG_FILE" 2>&1; then
    log "ERROR: push failed"
    exit 1
  fi
  remaining=0
  if [[ -f "$QUEUE_FILE" ]]; then
    remaining="$(grep -c . "$QUEUE_FILE" || true)"
  fi
  log "queue-only push done; remaining=$remaining"
  exit 0
fi

log "npm run build"
if ! npm run build >>"$LOG_FILE" 2>&1; then
  log "ERROR: build failed; commits remain local, not pushed."
  exit 1
fi
log "build SUCCESS"

log "git push origin HEAD"
if ! git push origin HEAD >>"$LOG_FILE" 2>&1; then
  log "ERROR: push failed"
  exit 1
fi
remaining=0
if [[ -f "$QUEUE_FILE" ]]; then
  remaining="$(grep -c . "$QUEUE_FILE" || true)"
fi
log "push done; remaining=$remaining"
