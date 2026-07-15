#!/usr/bin/env bash
set -euo pipefail

repo="doublemoreart-dotcom/sporttech"
branch="gh-pages"
repo_root="$(git rev-parse --show-toplevel)"
root="${1:-${repo_root}/../../outputs/github-pages}"

json_escape() {
  node -e 'process.stdout.write(JSON.stringify(process.argv[1]))' "$1"
}

create_blob() {
  local local_path="$1"
  local payload
  local content

  payload="$(mktemp)"
  content="$(openssl base64 -A -in "${local_path}")"
  printf '{"content":%s,"encoding":"base64"}' "$(json_escape "${content}")" >"${payload}"
  gh api "repos/${repo}/git/blobs" --method POST --input "${payload}" --jq '.sha'
  rm -f "${payload}"
}

base_sha="$(gh api "repos/${repo}/git/ref/heads/main" --jq '.object.sha')"

if ! gh api "repos/${repo}/git/ref/heads/${branch}" >/dev/null 2>&1; then
  gh api "repos/${repo}/git/refs" \
    --method POST \
    -f "ref=refs/heads/${branch}" \
    -f "sha=${base_sha}" >/dev/null
fi

parent_sha="$(gh api "repos/${repo}/git/ref/heads/${branch}" --jq '.object.sha')"
base_tree_sha="$(gh api "repos/${repo}/git/commits/${parent_sha}" --jq '.tree.sha')"

tree_entries="$(mktemp)"
first_entry=true

while IFS= read -r -d '' file; do
  rel_path="${file#${root}/sporttech/}"
  file_sha="$(create_blob "${file}")"

  for target_path in "${rel_path}" "sporttech/${rel_path}"; do
    if [[ "${first_entry}" == true ]]; then
      first_entry=false
    else
      printf ',\n' >>"${tree_entries}"
    fi
    printf '    {"path": %s, "mode": "100644", "type": "blob", "sha": %s}' \
      "$(json_escape "${target_path}")" \
      "$(json_escape "${file_sha}")" >>"${tree_entries}"
  done
done < <(find "${root}/sporttech" -type f -print0 | sort -z)

tree_payload="$(mktemp)"
cat >"${tree_payload}" <<JSON
{
  "base_tree": "${base_tree_sha}",
  "tree": [
$(cat "${tree_entries}")
  ]
}
JSON
rm -f "${tree_entries}"
tree_sha="$(gh api "repos/${repo}/git/trees" --method POST --input "${tree_payload}" --jq '.sha')"
rm -f "${tree_payload}"

commit_payload="$(mktemp)"
cat >"${commit_payload}" <<JSON
{
  "message": "Deploy sporttech static page to GitHub Pages",
  "tree": "${tree_sha}",
  "parents": ["${parent_sha}"]
}
JSON
commit_sha="$(gh api "repos/${repo}/git/commits" --method POST --input "${commit_payload}" --jq '.sha')"
rm -f "${commit_payload}"

ref_payload="$(mktemp)"
cat >"${ref_payload}" <<JSON
{
  "sha": "${commit_sha}",
  "force": false
}
JSON
gh api "repos/${repo}/git/refs/heads/${branch}" --method PATCH --input "${ref_payload}" >/dev/null
rm -f "${ref_payload}"

if gh api "repos/${repo}/pages" >/dev/null 2>&1; then
  gh api "repos/${repo}/pages" \
    --method PUT \
    -f "source[branch]=${branch}" \
    -f "source[path]=/" >/dev/null
else
  gh api "repos/${repo}/pages" \
    --method POST \
    -f "source[branch]=${branch}" \
    -f "source[path]=/" >/dev/null
fi

gh api "repos/${repo}/pages"
