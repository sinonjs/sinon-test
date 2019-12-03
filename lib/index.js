/**
 * Test case, sandboxes all test functions
 */
"use strict";

var test = require("./test");

function sinonTest(sinon, config) {
    return test.configure(sinon, config);
}

module.exports = sinonTest;
