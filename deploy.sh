#!/usr/bin/env bash

set -euo pipefail

# Specialized deploy for next-baz-car only.
# Usage:
#   ./deploy.sh -m "commit message"
#
# Optional env vars:
#   DEPLOY_HOST=95.163.226.53
#   DEPLOY_USER=root
#   DEPLOY_PORT=22
#   DEPLOY_KEY=~/.ssh/baz_car_deploy_ed25519
#   REMOTE_DIR=~/next-baz-car
#   PM2_APP_NAME=baz

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

DEPLOY_HOST="${DEPLOY_HOST:-95.163.226.53}"
DEPLOY_USER="${DEPLOY_USER:-root}"
DEPLOY_PORT="${DEPLOY_PORT:-22}"
DEPLOY_KEY="${DEPLOY_KEY:-$HOME/.ssh/baz_car_deploy_ed25519}"
REMOTE_DIR="${REMOTE_DIR:-~/next-baz-car}"
PM2_APP_NAME="${PM2_APP_NAME:-baz}"

COMMIT_MSG=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    -m|--message)
      shift
      COMMIT_MSG="${1:-}"
      ;;
    -h|--help)
      echo "Usage: ./deploy.sh -m \"commit message\""
      exit 0
      ;;
    *)
      echo "Unknown arg: $1"
      echo "Use --help"
      exit 1
      ;;
  esac
  shift
done

if [[ -z "$COMMIT_MSG" ]]; then
  echo "Error: commit message is required. Example: ./deploy.sh -m \"hero update\""
  exit 1
fi

cd "$PROJECT_DIR"

echo "==> Project: $PROJECT_DIR"
echo "==> Remote: $DEPLOY_USER@$DEPLOY_HOST:$REMOTE_DIR"
echo "==> PM2 app: $PM2_APP_NAME"

if [[ -n "$(git status --porcelain)" ]]; then
  echo "==> Staging and committing local changes..."
  git add -A
  git commit -m "$COMMIT_MSG"
else
  echo "==> No local changes to commit. Skipping commit."
fi

echo "==> Pushing to remote repository..."
git push

SSH_OPTS=(-p "$DEPLOY_PORT" -o BatchMode=yes -o StrictHostKeyChecking=accept-new)
if [[ -f "$DEPLOY_KEY" ]]; then
  SSH_OPTS+=(-i "$DEPLOY_KEY")
fi

echo "==> Running remote deploy commands..."
ssh "${SSH_OPTS[@]}" "$DEPLOY_USER@$DEPLOY_HOST" \
  "cd \"$REMOTE_DIR\" && git pull && yarn install && yarn build && pm2 restart \"$PM2_APP_NAME\""

echo "✅ Next deploy completed successfully."
