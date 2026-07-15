#!/usr/bin/env bash
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel)"
outputs_root="${repo_root}/../../outputs"
source_html="${outputs_root}/index.html"
local_html="${outputs_root}/sporttech-budget-static-v2.html"
pages_root="${outputs_root}/github-pages/sporttech"
pages_html="${pages_root}/index.html"

require_file() {
  local path="$1"
  if [[ ! -f "${path}" ]]; then
    echo "Missing required file: ${path}" >&2
    exit 1
  fi
}

require_file "${source_html}"
require_file "${outputs_root}/assets/favicon.svg"
require_file "${outputs_root}/assets/sporttech-budget-hero.jpg"
require_file "${pages_root}/assets/favicon.svg"
require_file "${pages_root}/assets/sporttech-budget-hero-small.jpg"

cp "${source_html}" "${local_html}"
cp "${source_html}" "${pages_html}"

python3 - "${pages_html}" <<'PY'
from pathlib import Path
import sys

path = Path(sys.argv[1])
text = path.read_text(encoding="utf-8")
text = text.replace(
    'src="assets/sporttech-budget-hero.jpg"',
    'src="assets/sporttech-budget-hero-small.jpg"',
)
path.write_text(text, encoding="utf-8")
PY

grep -q 'href="#sources">資料來源' "${local_html}"
grep -q 'href="#sources">資料來源' "${pages_html}"
grep -q 'sporttech-budget-hero-small.jpg' "${pages_html}"

echo "Synced static outputs:"
echo "  ${local_html}"
echo "  ${pages_html}"
