#!/bin/bash
# Verify that this version of sinon-test works with external libraries
#
# This script cannot run on Circle CI as a build step
# See https://circleci.com/gh/sinonjs/sinon-test/918
# The reason is that `npm link` is not allowed by the container

set -e; # exit on errors
set -x

# make sure we can call this script from everywhere and still have relative paths working
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
pushd "$SCRIPT_DIR" > /dev/null

main(){
    build_test_files
    link_local_sinon_test
    run_test_with_local_version
    cleanup
}

build_test_files(){
    cat esm-pre.mjs test-body.js > test.mjs
    cat cjs-pre.js test-body.js > test.js
    cat esm-bundle-pre.mjs test-body.js > test-bundle.mjs
    cat umd-bundle-pre.js test-body.js > test-bundle.js
}

link_local_sinon_test(){
    cd "$SCRIPT_DIR"/..
    npm link # create a global symlink to the local sinon-test project
}

cleanup(){
    cd "$SCRIPT_DIR"/..
    npm unlink sinon-test
}

run_test_with_local_version(){
    cd "$SCRIPT_DIR"
    npm install
    npm link sinon-test # use local version
    npm test
}

main
