/**
 * Internal utilities for sinon-test
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";

/**
 * From version 3.1 Sinon uses factory methods for sandboxes and deprecates
 * sinon.sandbox. It - and its exports - will in time be removed/internalized, but
 * we can still support backwards compatibility easily.
 * See Sinon pull request #1515
*/
function isOlderSinonVersion(sinonObj) {
    return typeof sinonObj.createSandbox === "undefined"
        && !!sinonObj.sandbox
        && typeof sinonObj.sandbox === "object"
        && typeof sinonObj.sandbox.create === "function";
}

exports.isPromise = function (object) {
    return typeof object === "object" && typeof object.then === "function";
};

exports.isSinon = function (obj) {
    return !!obj && typeof obj === "object"
        && (isOlderSinonVersion(obj) || typeof obj.createSandbox === "function");
};
