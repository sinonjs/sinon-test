"use strict";

var config = module.exports;

config.packaged = {
    environment: "browser",
    rootPath: "../",
    tests: [
        // Tests are browserify-ed before execution.
        "pkg/sinon-test-testrunner.js"
    ]
};

