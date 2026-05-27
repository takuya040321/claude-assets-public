#!/bin/bash
# claude-assets-public の rules を対象リポに symlink 配備するスクリプト
#
# Usage: bash ~/projects/claude-assets-public/bin/install-rules.sh <repo の root>
#
# 対象リポの .claude/rules/ に、claude-assets-public/rules/ 配下のファイルを
# symlink で配備する。既存の同名ファイルは上書きする。

set -euo pipefail

REPO_ROOT="${1:?Usage: $0 <repo root>}"
ASSETS_DIR="$(cd "$(dirname "$0")/.." && pwd)"
RULES_SRC="$ASSETS_DIR/rules"
RULES_DST="$REPO_ROOT/.claude/rules"

if [ ! -d "$RULES_SRC" ]; then
  echo "Error: $RULES_SRC does not exist"
  exit 1
fi

mkdir -p "$RULES_DST"

count=0
for f in "$RULES_SRC"/*.md; do
  [ -f "$f" ] || continue
  name="$(basename "$f")"
  ln -sf "$f" "$RULES_DST/$name"
  count=$((count + 1))
done

echo "Installed $count rules from claude-assets-public to $RULES_DST"
