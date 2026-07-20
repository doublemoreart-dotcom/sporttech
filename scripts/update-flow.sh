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
  - Pushing doublemoreart-dotcom/sporttech updates source code only.
  - dinopeng.com/sporttech/ updates only after syncing and pushing the main-site repo.

Steps:
  1. Regenerate derived favicon and social sharing assets.
  2. Check source quality with lint, build, and tests.
  3. Sync local static snapshots for browser review.
  4. Verify static output markers, assets, and fallback interactions.
  5. Deploy the sporttech repo GitHub Pages only when --deploy is passed.
  6. Print git status, diff summary, and local review targets.

After updating https://dinopeng.com/sporttech/ from the main-site repo, run:
  npm run status:public
  npm run verify:public
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
echo
echo "If the user says '推 Git' for source only:"
echo "  commit and push this repo: doublemoreart-dotcom/sporttech"
echo "  note: this does not update https://dinopeng.com/sporttech/"
echo "  then run npm run status:public to confirm whether main-site still needs sync"
echo
echo "If the user says to update https://dinopeng.com/sporttech/:"
echo "  1. fast-forward the main-site repo: doublemoreart-dotcom/dinopeng-com"
echo "  2. npm run sync:main-site"
echo "  3. review the main-site repo diff under /sporttech/"
echo "  4. commit and push the main-site repo"
echo "  5. run npm run status:public to locate any source/main-site/live mismatch"
echo "  6. run npm run verify:public to compare remote main, raw HTML, and live HTML markers"
