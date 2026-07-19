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
  npm run sync:main-site

Local-first update policy:
  - npm run update:local checks source, rebuilds local static snapshots, and stops.
  - It never commits, pushes, logs in, creates tokens, or deploys.
  - Only run npm run update:deploy after an explicit publish decision.
  - dinopeng.com/sporttech/ updates only after syncing the main-site repo.

Steps:
  1. Regenerate derived favicon and social sharing assets.
  2. Check source quality with lint, build, and tests.
  3. Sync local static snapshots for browser review.
  4. Verify static output markers, assets, and fallback interactions.
  5. Deploy the sporttech repo GitHub Pages only when --deploy is passed.
  6. Print git status, diff summary, and local review targets.
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
echo "  Main site:  https://github.com/doublemoreart-dotcom/dinopeng-com"
echo "  Policy:     local review first; main-site sync and Git push only after an explicit user request"
echo

echo "Step 1/6: regenerate derived share assets"
npm run assets:social
echo

echo "Step 2/6: check source quality"
npm run check
echo

echo "Step 3/6: sync local static review files"
npm run sync
echo

echo "Step 4/6: verify static output"
npm run verify:static
echo

if [[ "${deploy}" == true ]]; then
  echo "Step 5/6: deploy sporttech repo GitHub Pages"
  npm run deploy:pages
else
  echo "Step 5/6: skip deploy by design"
  echo "  Review the local site first. Do not sync the main site or push Git until the user explicitly asks."
fi
echo

echo "Step 6/6: review local change summary"
git status -sb

if ! git diff --quiet; then
  echo
  echo "Changed file summary:"
  git diff --stat
fi

echo
echo "Local update flow complete."
echo
echo "Local artifacts ready:"
echo "  ../../outputs/sporttech-budget-static-v2.html"
echo "  ../../outputs/github-pages/sporttech/index.html"
echo
echo "Publish remains manual."
echo "When the user explicitly asks to update dinopeng.com/sporttech/:"
echo "  npm run sync:main-site"
echo "  review the main-site repo diff"
echo "  commit and push the main-site repo"
