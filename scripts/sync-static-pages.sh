#!/usr/bin/env bash
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel)"
outputs_root="${repo_root}/../../outputs"
source_html="${outputs_root}/index.html"
local_html="${outputs_root}/sporttech-budget-static-v2.html"
pages_root="${outputs_root}/github-pages/sporttech"
pages_html="${pages_root}/index.html"
public_root="${repo_root}/public"

node "${repo_root}/scripts/render-static-page.mjs"

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
require_file "${public_root}/sporttech-budget-hero-small.jpg"
require_file "${pages_root}/assets/favicon.svg"
require_file "${pages_root}/assets/sporttech-budget-hero.jpg"
require_file "${pages_root}/assets/sporttech-budget-hero-small.jpg"

cp "${source_html}" "${local_html}"
cp "${source_html}" "${pages_html}"
cp "${public_root}/sporttech-budget-hero-small.jpg" "${outputs_root}/assets/sporttech-budget-hero-small.jpg"
cp "${outputs_root}/assets/sporttech-budget-hero.jpg" "${pages_root}/assets/sporttech-budget-hero.jpg"
cp "${public_root}/sporttech-budget-hero-small.jpg" "${pages_root}/assets/sporttech-budget-hero-small.jpg"

grep -q 'href="#sources">資料來源' "${local_html}"
grep -q 'href="#sources">資料來源' "${pages_html}"
grep -q 'sporttech-budget-hero.jpg' "${pages_html}"
grep -q 'sporttech-budget-hero-small.jpg' "${pages_html}"

echo "Synced static outputs:"
echo "  ${local_html}"
echo "  ${pages_html}"
