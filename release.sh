#!/bin/sh
# Create a new release with commit notes since the last tag
git fetch --tags --quiet
last=$(git tag --sort=-v:refname | head -1 | tr -d 'v')
next=$((last + 1))
tag="v$next"
notes=$(git log "v$last"..HEAD --oneline)

if [ -z "$notes" ]; then
  echo "No new commits since v$last"
  exit 1
fi

echo "Creating release $tag with:"
echo "$notes"
echo ""
gh release create "$tag" --title "$tag" --notes "$notes"
