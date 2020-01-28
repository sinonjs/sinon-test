#!/bin/bash

set -e; # exit on errors

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
    npm unlink
}

run_test_with_local_version(){
    cd "$SCRIPT_DIR"
    npm install
    npm link sinon-test # use local version
    npm test
}

main
