#!/bin/bash
set -e
eval $(ssh-agent -s)

PRIVATE_KEY_CONTENTS=$(echo "$GITHUB_KEY" | sed 's/\\n/\n/g')
TEMP_KEY_FILE=".github_key"

echo "$PRIVATE_KEY_CONTENTS" > "$TEMP_KEY_FILE"
chmod 600 "$TEMP_KEY_FILE"
ssh-add "$TEMP_KEY_FILE"
rm "$TEMP_KEY_FILE"

git init .
git config --global user.name "Landemic API"
git config --global user.email "admin@landemic.io"

# ssh-keyscan github.com >> $HOME/.ssh/known_hosts
ssh -o StrictHostKeyChecking=no github.com 2>/dev/null || true
git remote add origin $GITHUB_REMOTE
git fetch origin
git reset --hard origin/main
git checkout main