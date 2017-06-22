/**
 * Test case, sandboxes all test functions
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";

var test = require("./test");

function sinonTest(sinon, config) {
    return test.configure(sinon, config);
}
sinonTest.configureTest = function (sinon, config) {
    console.log("sinonTest.configureTest is deprecated and will be removed from the public API in a future version of sinon-test"); // eslint-disable-line
    return test.configure(sinon, config);
};

module.exports = sinonTest;
