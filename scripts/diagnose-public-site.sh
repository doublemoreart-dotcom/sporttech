#!/usr/bin/env bash
set -euo pipefail

public_url="https://dinopeng.com/sporttech/"
source_repo_url="https://github.com/doublemoreart-dotcom/sporttech.git"
main_repo_url="https://github.com/doublemoreart-dotcom/dinopeng-com.git"
main_site_root="${MAIN_SITE_ROOT:-/Users/dino/Documents/Codex/2026-07-14/dinopeng-com-tptrees-dinopeng-com-aidata/work/dinopeng-com}"

repo_root="$(git rev-parse --show-toplevel)"
source_output="${repo_root}/../../outputs/github-pages/sporttech/index.html"
tmp_dir="${TMPDIR:-/tmp}"
source_raw_file="${tmp_dir}/sporttech-source-layout.tsx"
main_raw_file="${tmp_dir}/sporttech-main-raw.html"
live_file="${tmp_dir}/sporttech-live.html"

require_marker() {
  local file="$1"
  local marker="$2"
  local label="$3"

  if grep -qF "${marker}" "${file}"; then
    printf '  ✓ %s\n' "${label}"
  else
    printf '  ✗ %s\n' "${label}"
    printf '    missing marker: %s\n' "${marker}"
    return 1
  fi
}

check_html() {
  local label="$1"
  local file="$2"
  local failed=0

  echo "${label}"
  require_marker "${file}" "<title>運動X科技預算小幫手</title>" "current browser title" || failed=1
  require_marker "${file}" "sporttech-menu-icon.png" "menu/preload icon asset" || failed=1
  require_marker "${file}" "href=\"#sports\"" "sport section nav anchor" || failed=1
  require_marker "${file}" "運動項目預算表" "sport budget section" || failed=1
  require_marker "${file}" "G-K8SEFVT51N" "Google Analytics id" || failed=1
  echo

  return "${failed}"
}

cd "${repo_root}"

echo "SportTech public deployment status"
echo "  Source repo: ${source_repo_url}"
echo "  Main site:   ${main_repo_url}"
echo "  Public URL:  ${public_url}"
echo

source_head="$(git rev-parse HEAD)"
source_remote="$(git ls-remote "${source_repo_url}" main | awk '{print $1}')"
main_remote="$(git ls-remote "${main_repo_url}" main | awk '{print $1}')"

echo "Refs"
echo "  Local source HEAD: ${source_head}"
echo "  Remote source main: ${source_remote:-unresolved}"
echo "  Remote main-site main: ${main_remote:-unresolved}"
if [[ -d "${main_site_root}/.git" ]]; then
  echo "  Local main-site: $(git -C "${main_site_root}" rev-parse HEAD)"
fi
echo

if [[ "${source_remote}" != "${source_head}" ]]; then
  echo "Source repo is not pushed to GitHub yet."
  echo "Run the source Git push flow first, then re-run npm run status:public."
  exit 1
fi

if [[ ! -f "${source_output}" ]]; then
  echo "Missing local static output: ${source_output}" >&2
  echo "Run npm run sync first." >&2
  exit 1
fi

curl -fsSL "https://raw.githubusercontent.com/doublemoreart-dotcom/sporttech/${source_remote}/app/layout.tsx" -o "${source_raw_file}"
curl -fsSL "https://raw.githubusercontent.com/doublemoreart-dotcom/dinopeng-com/${main_remote}/sporttech/index.html" -o "${main_raw_file}"
curl -fsSL "${public_url}?verify=${main_remote}" -o "${live_file}"

source_failed=0
main_failed=0
live_failed=0

echo "Source repo raw metadata"
require_marker "${source_raw_file}" 'title: "運動X科技預算小幫手"' "source metadata title" || source_failed=1
echo

check_html "Local generated static output" "${source_output}" || source_failed=1
check_html "Main-site raw /sporttech/index.html" "${main_raw_file}" || main_failed=1
check_html "Live public URL" "${live_file}" || live_failed=1

if [[ "${main_failed}" -ne 0 ]]; then
  echo "Diagnosis: source repo is current, but main-site repo has not been synced with the latest /sporttech/ output."
  echo "Next: run npm run sync:main-site, review the dinopeng-com diff, then commit and push the main-site repo."
  exit 1
fi

if [[ "${live_failed}" -ne 0 ]]; then
  echo "Diagnosis: main-site raw output is current, but live site is still old."
  echo "Next: wait for GitHub Pages/CDN cache, then run npm run verify:public again."
  exit 1
fi

if [[ "${source_failed}" -ne 0 ]]; then
  echo "Diagnosis: local generated output is stale or source metadata is incomplete."
  echo "Next: run npm run sync and commit/push the source repo again if output changed."
  exit 1
fi

echo "Diagnosis: source repo, main-site raw output, and live URL all contain the current SportTech markers."
