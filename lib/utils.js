/**
 * Internal utilities for sinon-test
 */
"use strict";

exports.isPromise = function (object) {
    return typeof object === "object" && typeof object.then === "function";
};

exports.isSinon = function (obj) {
    return (
        Boolean(obj) &&
        typeof obj === "object" &&
        typeof obj.createSandbox === "function"
    );
};
