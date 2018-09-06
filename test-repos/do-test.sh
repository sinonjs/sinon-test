#!/bin/bash
set -e;

# make sure we can call this script from everywhere and still have relative paths working
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
pushd "$SCRIPT_DIR" > /dev/null

# build test files
cat esm-pre.mjs test-body.js > test.mjs
cat cjs-pre.js test-body.js > test.js
cat esm-bundle-pre.mjs test-body.js > test-bundle.mjs
cat umd-bundle-pre.js test-body.js > test-bundle.js

cd ..
npm link # create a global symlink to the local sinon-test project
cd "$SCRIPT_DIR"

npm install
npm link sinon-test # use local version
npm test
