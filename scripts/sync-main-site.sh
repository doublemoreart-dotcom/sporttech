#!/usr/bin/env bash
set -euo pipefail

dry_run=false

for arg in "$@"; do
  case "${arg}" in
    --dry-run)
      dry_run=true
      ;;
    -h|--help)
      cat <<'HELP'
Usage:
  npm run sync:main-site
  npm run sync:main-site:dry-run

Purpose:
  Copy the verified static SportTech output into the dinopeng.com main-site
  repository, because https://dinopeng.com/sporttech/ is served from that repo.

Policy:
  - This command never commits or pushes.
  - Review the main-site diff first.
  - Push the main-site repo only after an explicit publish request.

Environment:
  MAIN_SITE_ROOT can override the default local dinopeng-com repo path.
HELP
      exit 0
      ;;
    *)
      echo "Unknown option: ${arg}" >&2
      exit 1
      ;;
  esac
done

repo_root="$(git rev-parse --show-toplevel)"
source_root="${repo_root}/../../outputs/github-pages/sporttech"
main_site_root="${MAIN_SITE_ROOT:-/Users/dino/Documents/Codex/2026-07-14/dinopeng-com-tptrees-dinopeng-com-aidata/work/dinopeng-com}"
target_root="${main_site_root}/sporttech"

require_file() {
  local path="$1"
  if [[ ! -f "${path}" ]]; then
    echo "Missing required file: ${path}" >&2
    exit 1
  fi
}

require_dir() {
  local path="$1"
  if [[ ! -d "${path}" ]]; then
    echo "Missing required directory: ${path}" >&2
    exit 1
  fi
}

require_dir "${source_root}"
require_dir "${source_root}/assets"
require_file "${source_root}/index.html"
require_file "${source_root}/assets/favicon.svg"
require_file "${source_root}/assets/index-DfS8gadw.css"

if ! grep -q '運動X科技預算小幫手' "${source_root}/index.html"; then
  echo "Static source does not look like the current SportTech page." >&2
  exit 1
fi

require_dir "${main_site_root}/.git"
main_remote="$(git -C "${main_site_root}" remote get-url origin)"

if [[ "${main_remote}" != *"doublemoreart-dotcom/dinopeng-com"* ]]; then
  echo "Unexpected main-site remote: ${main_remote}" >&2
  exit 1
fi

echo "SportTech main-site sync:"
echo "  Source: ${source_root}"
echo "  Target: ${target_root}"
echo "  Remote: ${main_remote}"
echo "  Mode:   $([[ "${dry_run}" == true ]] && echo "dry run" || echo "write local files")"
echo

main_status="$(git -C "${main_site_root}" status -sb)"
if [[ "${main_status}" == *"[behind "* ]]; then
  echo "Main-site repo is behind origin. Update it before syncing SportTech:" >&2
  echo "${main_status}" >&2
  echo "Suggested review command: git -C \"${main_site_root}\" pull --ff-only origin main" >&2
  exit 1
fi

mkdir -p "${target_root}"

rsync_args=(-av --delete)
if [[ "${dry_run}" == true ]]; then
  rsync_args=(-anv --delete)
fi

rsync "${rsync_args[@]}" "${source_root}/" "${target_root}/"
echo

if [[ "${dry_run}" == false ]]; then
  require_file "${target_root}/index.html"
  grep -q '運動X科技預算小幫手' "${target_root}/index.html"
fi

echo "Main-site repo status:"
echo "${main_status}"
echo

echo "Next step:"
echo "  Review the main-site diff. Publish only after an explicit Git push request."
echo "  See README.md > 更新流程 > Git 推版."
