var config = module.exports;

config.packaged = {
    environment: "browser",
    rootPath: "../",
    libs: [
    ],
    sources: [
        "pkg/sinon-test-testrunner.js"
    ],
    testHelpers: [
        "test/test-helper.js"
    ],
    tests: [
        "test/**/*-test.js"
    ]
};

