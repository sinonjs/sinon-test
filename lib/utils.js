/**
 * Internal utilities for sinon-test
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";

exports.isPromise = function (object) {
    return typeof object === "object" && typeof object.then === "function";
};

exports.isSinon = function (obj) {
    return !!obj && typeof obj === "object" &&
        !!obj.sandbox && typeof obj.sandbox === "object" && typeof obj.sandbox.create === "function";
};
