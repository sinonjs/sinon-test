/**
 * Test function, sandboxes fakes
 */
"use strict";

const utils = require("./utils");
const getConfig = require("./get-config");
const defaultConfig = require("./default-config");
const slice = Array.prototype.slice;

function finish(sandbox, error, dontThrow) {
    if (error) {
        sandbox.restore();

        if (dontThrow) {
            return;
        }

        throw error;
    }

    sandbox.verifyAndRestore();
}

function handleFn(sandbox, result) {
    if (result && utils.isPromise(result)) {
        return result.then(
            function sinonHandlePromiseResolve(value) {
                finish(sandbox);

                return value;
            },
            function sinonHandlePromiseReject(error) {
                finish(
                    sandbox,
                    error || new Error("Promise rejected with no/falsy error")
                );
            }
        );
    }

    finish(sandbox);

    return result;
}

function handleAsyncFn(sandbox, result, isAsync) {
    if (result && utils.isPromise(result)) {
        if (!isAsync) {
            // # issue #75
            return handleFn(sandbox, result);
        }

        finish(
            sandbox,
            new Error(
                "Your test should take a callback *or* return a promise. " +
                    "It should not do both."
            )
        );
    }

    // the function had an arity of 1 or more, but it was not passed a callback
    if (!isAsync) {
        finish(sandbox);
    }

    return null;
}

function configure(sinon, config) {
    if (!utils.isSinon(sinon)) {
        throw new TypeError("expected sinon object");
    }

    const sandboxFactory = sinon.createSandbox || sinon.sandbox.create;

    function callSandboxedFn(context, args, fn, handler) {
        const internalConfig = getConfig(defaultConfig, config);
        internalConfig.injectInto =
            (internalConfig.injectIntoThis && context) ||
            internalConfig.injectInto;
        const sandbox = sandboxFactory(internalConfig);
        const done = args.length && args.at(-1);
        let result;

        if (typeof done === "function") {
            args[args.length - 1] = function sinonDone(error) {
                finish(sandbox, error, true);
                done(error);
            };
        }

        try {
            result = fn.apply(context, args.concat(sandbox.args));
        } catch (e) {
            finish(sandbox, e);
        }

        return handler(sandbox, result, typeof done === "function");
    }

    return function test(callback) {
        const type = typeof callback;

        if (type !== "function") {
            throw new TypeError(
                `sinon.test needs to wrap a test function, got ${type}`
            );
        }

        return callback.length
            ? // eslint-disable-next-line no-unused-vars -- length 1 tells mocha the test takes done
              function sinonAsyncSandboxedTest(_) {
                  return callSandboxedFn(
                      this,
                      // eslint-disable-next-line prefer-rest-params -- a rest parameter would change length
                      slice.call(arguments),
                      callback,
                      handleAsyncFn
                  );
              }
            : function sinonSandboxedTest(...args) {
                  return callSandboxedFn(this, args, callback, handleFn);
              };
    };
}

module.exports.configure = configure;
