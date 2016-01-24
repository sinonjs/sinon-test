"use strict";

var config = module.exports;

config.node = {
    environment: "node",
    rootPath: "../",
    testHelpers: [
        "test/test-helper.js"
    ],
    sources: [
        "lib/index.js",
        "lib/*.js"
    ],
    tests: [
        "test/**/*-test.js"
    ]
};

config.coverage = {
    extends: "node",
    "buster-istanbul": {
        outputDirectory: "coverage",
        format: "lcov",
        excludes: ["**/*.json"]
    },
    extensions: [
        require("buster-istanbul")
    ]
};
