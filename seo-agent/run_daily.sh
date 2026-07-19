#!/usr/bin/env bash
# SousXChef daily SEO publisher — generate post, commit, push.
set -euo pipefail

ROOT="/root/SouSxChef"
AGENT="$ROOT/seo-agent"
LOG_DIR="$AGENT/logs"
LOG="$LOG_DIR/daily.log"
# Reuse HireReady venv (same openai dep) or local
VENV="$AGENT/.venv"
HR_VENV="/root/resume-ats/seo-agent/.venv"
PYTHON="$VENV/bin/python"

mkdir -p "$LOG_DIR"
exec >>"$LOG" 2>&1

echo "======== $(date -Is) ========"

cd "$ROOT"

# Same OpenRouter key as HireReady (symlink or local .env)
if [[ -f "$AGENT/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$AGENT/.env"
  set +a
elif [[ -f /root/resume-ats/seo-agent/.env ]]; then
  set -a
  # shellcheck disable=SC1091
  source /root/resume-ats/seo-agent/.env
  set +a
fi

export GIT_AUTHOR_NAME="${GIT_AUTHOR_NAME:-Adil Khatri}"
export GIT_AUTHOR_EMAIL="${GIT_AUTHOR_EMAIL:-khatriadil044@gmail.com}"
export GIT_COMMITTER_NAME="${GIT_COMMITTER_NAME:-SousXChef SEO Agent}"
export GIT_COMMITTER_EMAIL="${GIT_COMMITTER_EMAIL:-seo-agent@sousxchef.online}"

if command -v gh >/dev/null 2>&1; then
  gh auth setup-git >/dev/null 2>&1 || true
fi

git pull --ff-only origin main

ARGS=(--once-per-day)
if [[ -z "${OPENROUTER_API_KEY:-}" ]]; then
  ARGS+=(--fallback)
  echo "No OPENROUTER_API_KEY — using fallback template"
fi

if [[ ! -x "$PYTHON" ]]; then
  if [[ -x "$HR_VENV/bin/python" ]]; then
    PYTHON="$HR_VENV/bin/python"
  else
    PYTHON=python3
  fi
fi

"$PYTHON" "$AGENT/generate_post.py" "${ARGS[@]}"

if git diff --quiet && [[ -z "$(git status --porcelain)" ]]; then
  echo "No changes to commit"
  exit 0
fi

git add content/blog seo-agent/queue.json seo-agent/published.json src/lib/blog.ts
git commit -m "seo: daily SousXChef blog post $(date -u +%Y-%m-%d)"
git push origin main

echo "Pushed OK"
