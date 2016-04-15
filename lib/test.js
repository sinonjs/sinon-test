/**
 * Test function, sandboxes fakes
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";

var utils = require("./utils");
var slice = Array.prototype.slice;

function configure(sinon, config) {
    if (!utils.isSinon(sinon)) {
        throw new TypeError("expected sinon object");
    }

    if (!config) {
        config = {
            injectIntoThis: true,
            injectInto: null,
            properties: ["spy", "stub", "mock", "clock", "server", "requests"],
            useFakeTimers: true,
            useFakeServer: true
        };
    }

    return function test(callback) {
        var type = typeof callback;

        if (type !== "function") {
            throw new TypeError("sinon.test needs to wrap a test function, got " + type);
        }

        function sinonSandboxedTest() {
            config = sinon.getConfig(config);
            config.injectInto = config.injectIntoThis && this || config.injectInto;

            var sandbox = sinon.sandbox.create(config);
            var args = slice.call(arguments);
            var oldDone = args.length && args[args.length - 1];
            var exception, result;

            if (typeof oldDone === "function") {
                args[args.length - 1] = function sinonDone(res) {
                    if (res) {
                        sandbox.restore();
                    } else {
                        sandbox.verifyAndRestore();
                    }
                    oldDone(res);
                };
            }

            try {
                result = callback.apply(this, args.concat(sandbox.args));
            } catch (e) {
                exception = e;
            }
            if (result != null && typeof result.then === "function" && typeof result.catch === "function") {
                // A test may signal that it is asynchronous by returning a promise instead of accepting 
                // a callback. We handle here by chaining sandbox cleanup to occur after the promise 
                // resolves or rejects.
                result = result.catch(function (err) {
                    sandbox.restore();
                    throw err;
                }).then(function (res) {
                    sandbox.verifyAndRestore();
                    return res;
                });
            }
            else if (typeof oldDone !== "function") {
                if (typeof exception !== "undefined") {
                    sandbox.restore();
                    throw exception;
                } else {
                    sandbox.verifyAndRestore();
                }
            }

            return result;
        }

        if (callback.length) {
            return function sinonAsyncSandboxedTest(done) { // eslint-disable-line no-unused-vars
                return sinonSandboxedTest.apply(this, arguments);
            };
        }

        return sinonSandboxedTest;
    };
}

module.exports.configure = configure;
