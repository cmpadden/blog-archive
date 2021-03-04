#!/bin/sh
#
# Deploy to cmpadden.github.io through the `public` git submodule
# See: https://gohugo.io/hosting-and-deployment/hosting-on-github/#step-by-step-instructions

set -e

# if [ "$(git status -s)" ]
# then
#     echo "The working directory is dirty. Please commit any pending changes."
#     exit 1;
# fi

CURRENT_COMMIT=$(git rev-parse --short HEAD)

printf "\033[0;32mDeploying updates to GitHub...\033[0m\n"
printf "Commit ID: %s\n" "$CURRENT_COMMIT"

# Build the project.
hugo

#f Go To Public folder
cd public

# Add changes to git.
git add .

# Commit changes.
msg="built site from /cmpadden/blog (${CURRENT_COMMIT})"
git commit -m "$msg"

# Push source and build repos.
git push origin master
