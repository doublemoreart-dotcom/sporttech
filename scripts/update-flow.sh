#!/usr/bin/env bash
set -euo pipefail

deploy=false

for arg in "$@"; do
  case "${arg}" in
    --deploy)
      deploy=true
      ;;
    -h|--help)
      cat <<'HELP'
Usage:
  npm run update:local
  npm run update:deploy

Steps:
  1. Run lint, build, and tests.
  2. Sync local static snapshots.
  3. Verify static output markers, assets, and fallback interactions.
  4. Optionally deploy to GitHub Pages with --deploy.
  5. Print git status and canonical URLs.
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
cd "${repo_root}"

echo "SportTech canonical targets:"
echo "  Public URL: https://dinopeng.com/sporttech/"
echo "  Repo:       https://github.com/doublemoreart-dotcom/sporttech"
echo

echo "Step 1/5: run checks"
npm run check
echo

echo "Step 2/5: sync local static snapshots"
npm run sync
echo

echo "Step 3/5: verify static output"
npm run verify:static
echo

if [[ "${deploy}" == true ]]; then
  echo "Step 4/5: deploy GitHub Pages"
  npm run deploy:pages
else
  echo "Step 4/5: skip deploy"
  echo "  Run npm run update:deploy when the synced version is ready to publish."
fi
echo

echo "Step 5/5: review git status"
git status --short
echo
echo "Update flow complete."
