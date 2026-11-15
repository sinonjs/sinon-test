#!/bin/bash
# Verify that this version of sinon-test works with the latest Sinon,
# both from source and from the bundles, as CommonJS and as ES modules

set -e; # exit on errors
set -x

# make sure we can call this script from everywhere and still have relative paths working
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
pushd "$SCRIPT_DIR" > /dev/null

main(){
    build_test_files
    build_dist
    run_test_with_latest_sinon
}

build_test_files(){
    cat esm-pre.mjs test-body.js > test.mjs
    cat cjs-pre.js test-body.js > test.js
    cat esm-bundle-pre.mjs test-body.js > test-bundle.mjs
    cat umd-bundle-pre.js test-body.js > test-bundle.js
}

# the bundle tests import ../dist, which `npm version` does not rebuild
build_dist(){
    cd "$SCRIPT_DIR"/..
    npm run build
}

run_test_with_latest_sinon(){
    cd "$SCRIPT_DIR"
    npm install --no-audit --no-fund
    npm test
}

main
