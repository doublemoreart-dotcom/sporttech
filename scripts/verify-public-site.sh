#!/usr/bin/env bash
set -euo pipefail

public_url="https://dinopeng.com/sporttech/"
main_repo_url="https://github.com/doublemoreart-dotcom/dinopeng-com.git"
main_site_root="${MAIN_SITE_ROOT:-/Users/dino/Documents/Codex/2026-07-14/dinopeng-com-tptrees-dinopeng-com-aidata/work/dinopeng-com}"
expected_ref=""

for arg in "$@"; do
  case "${arg}" in
    --ref=*)
      expected_ref="${arg#*=}"
      ;;
    -h|--help)
      cat <<'HELP'
Usage:
  npm run verify:public
  npm run verify:public -- --ref=<commit-or-branch>

Purpose:
  Verify that the public SportTech page is served from the expected main-site
  commit and still contains the required current-page markers.

Checks:
  1. Read the current doublemoreart-dotcom/dinopeng-com main commit.
  2. Fetch sporttech/index.html from that exact commit.
  3. Fetch https://dinopeng.com/sporttech/ with a cache-busting query string.
  4. Require GA, sport table, sorting, favicon, and OG image markers.

Environment:
  MAIN_SITE_ROOT can override the local dinopeng-com repo path.
HELP
      exit 0
      ;;
    *)
      echo "Unknown option: ${arg}" >&2
      exit 1
      ;;
  esac
done

require_marker() {
  local file="$1"
  local marker="$2"
  local label="$3"

  if ! grep -qF "${marker}" "${file}"; then
    echo "Missing ${label}: ${marker}" >&2
    echo "Checked file: ${file}" >&2
    exit 1
  fi
}

require_html_markers() {
  local file="$1"

  require_marker "${file}" "G-K8SEFVT51N" "Google Analytics id"
  require_marker "${file}" "googletagmanager.com/gtag/js?id=G-K8SEFVT51N" "Google tag script"
  require_marker "${file}" "運動項目預算表" "sport budget table title"
  require_marker "${file}" "data-sport-sort" "sport table sorting hook"
  require_marker "${file}" "href=\"#sports\"" "sports anchor"
  require_marker "${file}" "assets/favicon.ico" "favicon link"
  require_marker "${file}" "assets/og-image.png" "social image link"
}

repo_root="$(git rev-parse --show-toplevel)"
cd "${repo_root}"

tmp_dir="${TMPDIR:-/tmp}"
remote_ref_file="${tmp_dir}/sporttech-public-remote-ref.txt"
raw_file="${tmp_dir}/sporttech-public-raw.html"
live_file="${tmp_dir}/sporttech-public-live.html"

if [[ -d "${main_site_root}/.git" ]]; then
  main_remote="$(git -C "${main_site_root}" remote get-url origin)"
  if [[ "${main_remote}" != *"doublemoreart-dotcom/dinopeng-com"* ]]; then
    echo "Unexpected main-site remote: ${main_remote}" >&2
    exit 1
  fi
fi

echo "Checking public SportTech deployment"
echo "  Public URL: ${public_url}"
echo "  Main site:  ${main_repo_url}"

remote_ref="$(git ls-remote "${main_repo_url}" main | awk '{print $1}')"
if [[ -z "${remote_ref}" ]]; then
  echo "Unable to resolve remote main commit for ${main_repo_url}" >&2
  exit 1
fi
printf '%s\n' "${remote_ref}" > "${remote_ref_file}"
echo "  Remote main: ${remote_ref}"

if [[ -n "${expected_ref}" ]]; then
  expected_commit="$(git -C "${main_site_root}" rev-parse "${expected_ref}^{commit}" 2>/dev/null || true)"
  if [[ -z "${expected_commit}" ]]; then
    expected_commit="${expected_ref}"
  fi

  if [[ "${remote_ref}" != "${expected_commit}"* && "${expected_commit}" != "${remote_ref}"* ]]; then
    echo "Remote main does not match expected ref." >&2
    echo "  Expected: ${expected_commit}" >&2
    echo "  Actual:   ${remote_ref}" >&2
    exit 1
  fi
fi

curl -fsSL "https://raw.githubusercontent.com/doublemoreart-dotcom/dinopeng-com/${remote_ref}/sporttech/index.html" -o "${raw_file}"
raw_size="$(wc -c < "${raw_file}" | tr -d ' ')"
echo "  Raw HTML bytes: ${raw_size}"
require_html_markers "${raw_file}"

curl -fsSL "${public_url}?verify=${remote_ref}" -o "${live_file}"
live_size="$(wc -c < "${live_file}" | tr -d ' ')"
echo "  Live HTML bytes: ${live_size}"
require_html_markers "${live_file}"

if [[ "${live_size}" != "${raw_size}" ]]; then
  echo "Live HTML size differs from remote raw HTML." >&2
  echo "  Raw:  ${raw_size} bytes" >&2
  echo "  Live: ${live_size} bytes" >&2
  echo "This can be a CDN cache delay; retry after the Pages cache refreshes." >&2
  exit 1
fi

echo
echo "Public SportTech deployment verified."
