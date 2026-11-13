"use strict";

const sinonTest = require("../");
const referee = require("@sinonjs/referee");
const sinon = require("sinon");
const Promise = require("es6-promise").Promise;

const nextTick =
    (typeof process !== "undefined" && process.nextTick) ||
    function (fn) {
        setTimeout(fn, 0);
    };
const assert = referee.assert;
const refute = referee.refute;

const instance = sinonTest(sinon);

// promise-like structure
function stubPromise() {
    const thenStub = sinon.stub();
    const promise = {
        then: thenStub,
        index: 0,
        resolve(object) {
            const callback = thenStub.getCall(this.index++).args[0];
            if (object) {
                callback(object);
            } else {
                callback();
            }
        },
        reject(error) {
            const callback = thenStub.getCall(this.index++).args[1];
            if (error) {
                callback(error);
            } else {
                callback();
            }
        },
    };

    thenStub.returns(promise);

    return promise;
}

module.exports = {
    beforeEach() {
        this.boundTestCase = function () {
            var properties = {
                fn() {
                    properties.self = this;
                    properties.args = arguments;
                    properties.spy = this.spy;
                    properties.stub = this.stub;
                    properties.mock = this.mock;
                    properties.clock = this.clock;
                    properties.server = this.server;
                    properties.requests = this.requests;
                    properties.sandbox = this.sandbox;
                },
            };

            return properties;
        };
    },

    "throws if argument is not a function"() {
        assert.exception(() => {
            instance({});
        });
    },

    "proxies return value"() {
        const object = {};

        const result = instance(() => object)();

        assert.same(result, object);
    },

    "stubs inside sandbox"() {
        // eslint-disable-next-line no-empty-function
        const method = function () {};
        const object = { method };

        instance(function () {
            this.stub(object, "method").returns(object);

            assert.same(object.method(), object);
        }).call({});
    },

    "restores stubs"() {
        // eslint-disable-next-line no-empty-function
        const method = function () {};
        const object = { method };

        instance(function () {
            this.stub(object, "method");
        }).call({});

        assert.same(object.method, method);
    },

    "restores stubs on all object methods"() {
        // eslint-disable-next-line no-empty-function
        const method = function () {};
        // eslint-disable-next-line no-empty-function
        const method2 = function () {};
        const object = { method, method2 };

        instance(function () {
            this.stub(object);
        }).call({});

        assert.same(object.method, method);
        assert.same(object.method2, method2);
    },

    "throws when method throws"() {
        // eslint-disable-next-line no-empty-function
        const method = function () {};
        const object = { method };

        assert.exception(() => {
            instance(function () {
                this.stub(object, "method");
                throw new Error();
            }).call({});
        }, "Error");
    },

    "throws when an async method throws"() {
        // eslint-disable-next-line no-empty-function
        const method = function () {};
        const object = { method };
        // eslint-disable-next-line no-empty-function
        const fakeDone = function () {};

        assert.exception(() => {
            // eslint-disable-next-line no-unused-vars
            instance(function (done) {
                this.stub(object, "method");
                throw new Error();
            }).call({}, fakeDone);
        }, "Error");
    },

    "restores stub after promise resolves"() {
        const object = {};

        const promise = instance(
            () =>
                new Promise((resolve) => {
                    nextTick(() => {
                        resolve(object);
                    });
                })
        ).call({});

        return promise.then((result) => {
            assert.same(result, object);
        });
    },

    "restores stub after promise is resolved"() {
        // eslint-disable-next-line no-empty-function
        const method = function () {};
        const object = { method };

        const promise = instance(function () {
            this.stub(object, "method");
            return new Promise((resolve) => {
                nextTick(() => {
                    resolve(object);
                });
            });
        }).call({});

        assert.equals(object.method === method, false);

        return promise.then(() => {
            assert.same(object.method, method);
        });
    },

    "restores stub after promise is rejected"() {
        // eslint-disable-next-line no-empty-function
        const method = function () {};
        const object = { method };

        const promise = instance(function () {
            this.stub(object, "method");
            return new Promise((_, reject) => {
                nextTick(() => {
                    reject(new Error());
                });
            });
        }).call({});

        assert.equals(object.method === method, false);

        return promise.then(null, (err) => {
            assert.equals(err instanceof Error, true);
        });
    },

    "returns the test's promise even if the test function has parameters (e.g. assert in QUnit)"() {
        // eslint-disable-next-line no-empty-function
        const method = function () {};
        const object = { method };

        // eslint-disable-next-line no-unused-vars
        const promise = instance(function (QUnitAssert) {
            this.stub(object, "method");
            return Promise.resolve().then(() => {
                object.method();
            });
        }).call({});

        refute.isUndefined(promise);
    },

    "restores stub when method throws"() {
        // eslint-disable-next-line no-empty-function
        const method = function () {};
        const object = { method };

        try {
            instance(function () {
                this.stub(object, "method");
                throw new Error();
            }).call({});
        } catch {} // eslint-disable-line no-empty

        assert.same(object.method, method);
    },

    "mocks inside sandbox"() {
        // eslint-disable-next-line no-empty-function
        const method = function () {};
        const object = { method };

        instance(function () {
            this.mock(object).expects("method").returns(object);

            assert.same(object.method(), object);
        }).call({});
    },

    "passes on errors to callbacks"() {
        const fn = instance((callback) => {
            callback(new Error("myerror"));
        });

        function errorChecker(err) {
            errorChecker.called = true;
            assert.equals(err instanceof Error, true);
        }

        fn(errorChecker);
        assert.equals(errorChecker.called, true);
    },

    "async test with sandbox"(done) {
        const fakeDone = function (args) {
            assert.isUndefined(args);
            done(args);
        };

        instance((callback) => {
            nextTick(() => {
                callback();
            });
        }).call({}, fakeDone);
    },

    "async test with sandbox using mocha interface"(done) {
        const it = function (title, fn) {
            const mochaDone = function (args) {
                assert.isUndefined(args);
                done(args);
            };
            if (fn.length) {
                fn.call(this, mochaDone);
            } else {
                fn.call(this);
            }
        };

        it(
            "works",
            instance((callback) => {
                nextTick(() => {
                    callback();
                });
            })
        );
    },

    "async test with sandbox using mocha interface throwing error"(done) {
        const it = function (title, fn) {
            const mochaDone = function (args) {
                assert.isUndefined(args);
                done(args);
            };
            if (fn.length) {
                fn.call(this, mochaDone);
            } else {
                fn.call(this);
            }
        };

        it(
            "works",
            instance((callback) => {
                callback();
            })
        );
    },

    "async test with sandbox and spy"(done) {
        instance(function (callback) {
            const globalObj = {
                addOne(arg) {
                    return this.addOneInner(arg);
                },
                addOneInner(arg) {
                    return arg + 1;
                },
            };
            const addOneInnerSpy = this.spy();
            this.stub(globalObj, "addOneInner").callsFake(addOneInnerSpy);

            nextTick(() => {
                globalObj.addOne(41);
                assert(addOneInnerSpy.calledOnce);
                callback();
            });
        }).call({}, done);
    },

    "async test preserves additional args and pass them in correct order"(
        done
    ) {
        instance((arg1, arg2, callback) => {
            assert.equals(arg1, "arg1");
            assert.equals(typeof arg2, "object");
            assert.equals(typeof callback, "function");

            callback();
        }).call({}, "arg1", {}, done);
    },

    "async tests should allow thenables to be returned without a callback function"() {
        // eslint-disable-next-line no-unused-vars
        const test = instance((_) => Promise.resolve(true));

        const dummy = "this is not a callback function";
        refute.exception(() => {
            test(dummy);
        }, "hei");
    },

    "async tests should not allow thenables to be returned with a callback function"() {
        const thenable = {
            // eslint-disable-next-line no-empty-function
            then() {},
        };
        // eslint-disable-next-line no-unused-vars
        const test = instance((_) => thenable);

        // eslint-disable-next-line no-empty-function
        function callback() {}
        assert.exception(
            () => {
                test(callback);
            },
            {
                message: /callback .* promise.* both/,
            }
        );
    },

    "sync tests with thenable return value": {
        beforeEach() {
            // eslint-disable-next-line no-empty-function
            const method = (this.method = function () {});
            const object = (this.object = { method });
            const promise = (this.promise = stubPromise());

            this.sinonTest = instance(function () {
                this.stub(object, "method");

                return promise;
            });
        },

        afterEach() {
            // ensure sandbox is restored
            if (this.promise.index < this.promise.then.callCount) {
                this.promise.resolve();
            }
        },

        "should listen to returned promise"(done) {
            const self = this;
            const promise = self.sinonTest.call({});

            assert(promise.then.calledOnce);
            assert(promise.then.getCall(0).args.length, 2);
            assert.isFunction(promise.then.getCall(0).args[0]);
            assert.isFunction(promise.then.getCall(0).args[1]);

            // allow any other actions to take place
            nextTick(() => {
                refute.same(
                    self.object.method,
                    self.method,
                    "should wait to restore stubs"
                );

                done();
            });
        },

        "restores sandbox after promise is fulfilled"() {
            const promise = this.sinonTest.call({});

            promise.resolve();

            assert.same(this.object.method, this.method);
        },

        "restores sandbox after promise is rejected"() {
            const promise = this.sinonTest.call({});
            const error = new Error("expected");

            assert.exception(
                () => {
                    promise.reject(error);
                },
                { message: "expected" },
                "should re-throw error from rejected promise"
            );

            assert.same(this.object.method, this.method);
        },

        "ensures test rejects with a non-falsy value"() {
            const promise = this.sinonTest.call({});

            assert.exception(
                () => {
                    promise.reject(false);
                },
                { message: /rejected.*falsy/ }
            );

            assert.same(this.object.method, this.method);
        },
    },

    "sync tests with A+ promise returned": {
        beforeEach() {
            if (typeof Promise === "undefined") {
                this.skip();
            }

            // eslint-disable-next-line no-empty-function
            this.method = function () {};
            this.object = { method: this.method };
        },

        "restores the sandbox when the promise is fulfilled"(done) {
            const self = this;
            const expected = {};
            const test = instance(function () {
                const sandbox = this;

                return new Promise((resolve) => {
                    sandbox.stub(self.object, "method");

                    resolve(expected);
                });
            });

            test.call({}).then((thing) => {
                assert.equals(self.object.method, self.method);
                assert.same(thing, expected);

                done();
            });
        },

        "restores the sandbox when the promise is rejected"(done) {
            const self = this;
            const test = instance(function () {
                const sandbox = this;

                return new Promise((_, reject) => {
                    sandbox.stub(self.object, "method");

                    reject(new Error("Some error"));
                });
            });

            test.call({}).catch(() => {
                assert.equals(self.object.method, self.method);

                done();
            });
        },

        "ensures test rejects with a non-falsy value"(done) {
            const self = this;
            const test = instance(() => Promise.reject(false));

            test.call({}).catch((error) => {
                assert.match(error.message, /rejected.*falsy/);
                assert.same(self.object.method, self.method);

                done();
            });
        },

        "re-throws the error if the promise is rejected"(done) {
            const expectedError = new Error("expected");
            const test = instance(() => Promise.reject(expectedError));

            test.call({}).catch((error) => {
                assert.equals(error, expectedError);

                done();
            });
        },

        "verifies mocks when promise is resolved"(done) {
            const self = this;
            const test = instance(function () {
                const sandbox = this;

                return new Promise((resolve) => {
                    sandbox
                        .mock(self.object)
                        .expects("method")
                        .withExactArgs(1)
                        .once();

                    self.object.method(42);

                    resolve();
                });
            });

            test.call({}).catch((error) => {
                assert.equals(error.name, "ExpectationError");
                assert.match(error.message, /Expected method\(1\) once/);

                done();
            });
        },
    },

    "verifies mocks"() {
        // eslint-disable-next-line no-empty-function
        const method = function () {};
        const object = { method };
        let exception;

        try {
            instance(function () {
                this.mock(object).expects("method").withExactArgs(1).once();
                object.method(42);
            }).call({});
        } catch (e) {
            exception = e;
        }

        assert.same(exception.name, "ExpectationError");
        assert.equals(
            exception.message,
            "Unexpected call: method(42)\n" +
                "    Expected method(1) once (never called)"
        );
        assert.same(object.method, method);
    },

    "restores mocks"() {
        // eslint-disable-next-line no-empty-function
        const method = function () {};
        const object = { method };

        try {
            instance(function () {
                this.mock(object).expects("method");
            }).call({});
        } catch {} // eslint-disable-line no-empty

        assert.same(object.method, method);
    },

    "restores mock when method throws"() {
        // eslint-disable-next-line no-empty-function
        const method = function () {};
        const object = { method };

        try {
            instance(function () {
                this.mock(object).expects("method").never();
                object.method();
            }).call({});
        } catch {} // eslint-disable-line no-empty

        assert.same(object.method, method);
    },

    "appends helpers after normal arguments"() {
        // eslint-disable-next-line no-empty-function
        const object = { method() {} };
        const config = {
            injectIntoThis: false,
            properties: ["stub", "mock"],
        };

        const testInstance = sinonTest(sinon, config);

        testInstance((obj, stub, mock) => {
            mock(object).expects("method").once();
            object.method();

            assert.same(obj, object);
        })(object);
    },

    "maintains the this value"() {
        const testCase = {
            someTest: instance(function () {
                return this;
            }),
        };

        assert.same(testCase.someTest(), testCase);
    },

    "configurable test with sandbox": {
        "yields stub, mock as arguments"() {
            let stubbed, mocked;
            // eslint-disable-next-line no-empty-function
            const obj = { meth() {} };

            const config = {
                injectIntoThis: false,
                properties: ["stub", "mock"],
            };

            const testInstance = sinonTest(sinon, config);

            testInstance(function (stub, mock) {
                stubbed = stub(obj, "meth");
                mocked = mock(obj);

                assert.equals(arguments.length, 2);
            })();

            assert.stub(stubbed);
            assert.mock(mocked);
        },

        "yields spy, stub, mock as arguments"() {
            let spied, stubbed, mocked;
            // eslint-disable-next-line no-empty-function
            const obj = { meth() {} };

            const config = {
                injectIntoThis: false,
                properties: ["spy", "stub", "mock"],
            };

            const testInstance = sinonTest(sinon, config);

            testInstance(function (spy, stub, mock) {
                spied = spy(obj, "meth");
                spied.restore();
                stubbed = stub(obj, "meth");
                mocked = mock(obj);

                assert.equals(arguments.length, 3);
            })();

            assert.spy(spied);
            assert.stub(stubbed);
            assert.mock(mocked);
        },

        "does not yield server when not faking xhr"() {
            let stubbed, mocked;
            // eslint-disable-next-line no-empty-function
            const obj = { meth() {} };

            const config = {
                injectIntoThis: false,
                properties: ["server", "stub", "mock"],
                useFakeServer: false,
            };

            const testInstance = sinonTest(sinon, config);

            testInstance(function (stub, mock) {
                stubbed = stub(obj, "meth");
                mocked = mock(obj);

                assert.equals(arguments.length, 2);
            })();

            assert.stub(stubbed);
            assert.mock(mocked);
        },

        "backwards compatibility": {
            "uses the new factory methods introduced in 3.1 - if available"() {
                const fakeSinon = { createSandbox: sinon.stub() };
                const testInstance = sinonTest(fakeSinon);

                try {
                    // eslint-disable-next-line no-empty-function
                    testInstance(() => {})();
                } catch {
                    /* ignore */
                }

                assert(fakeSinon.createSandbox.called);
            },

            "falls back to the old 1.x-2.x methods when needed "() {
                const fakeSinon = { sandbox: { create: sinon.stub() } };
                const testInstance = sinonTest(fakeSinon);

                try {
                    // eslint-disable-next-line no-empty-function
                    testInstance(() => {})();
                } catch {
                    /* ignore */
                }

                assert(fakeSinon.sandbox.create.called);
            },
        },

        "browser options": {
            "yields server when faking xhr"() {
                let stubbed, mocked, server;
                // eslint-disable-next-line no-empty-function
                const obj = { meth() {} };

                const config = {
                    injectIntoThis: false,
                    properties: ["server", "stub", "mock"],
                };

                const testInstance = sinonTest(sinon, config);

                testInstance(function (serv, stub, mock) {
                    server = serv;
                    stubbed = stub(obj, "meth");
                    mocked = mock(obj);

                    assert.equals(arguments.length, 3);
                })();

                assert.fakeServer(server);
                assert.stub(stubbed);
                assert.mock(mocked);
            },

            "uses serverWithClock when faking xhr"() {
                let server;

                const config = {
                    injectIntoThis: false,
                    properties: ["server"],
                    useFakeServer: sinon.fakeServerWithClock,
                };

                const testInstance = sinonTest(sinon, config);

                testInstance((serv) => {
                    server = serv;
                })();

                assert.fakeServer(server);
                assert(sinon.fakeServerWithClock.isPrototypeOf(server));
            },

            "injects properties into object"() {
                const obj = {};

                const config = {
                    injectIntoThis: false,
                    injectInto: obj,
                    properties: [
                        "server",
                        "clock",
                        "spy",
                        "stub",
                        "mock",
                        "requests",
                    ],
                };

                const testInstance = sinonTest(sinon, config);

                function testFunction() {
                    assert.equals(arguments.length, 0);
                    assert.isUndefined(this.server);
                    assert.isUndefined(this.clock);
                    assert.isUndefined(this.spy);
                    assert.isUndefined(this.stub);
                    assert.isUndefined(this.mock);
                    assert.isUndefined(this.requests);
                    assert.fakeServer(obj.server);
                    assert.clock(obj.clock);
                    assert.isFunction(obj.spy);
                    assert.isFunction(obj.stub);
                    assert.isFunction(obj.mock);
                    assert.isArray(obj.requests);
                }

                testInstance(testFunction).call({});
            },

            "injects server and clock when only enabling them"() {
                const config = {
                    useFakeTimers: true,
                    useFakeServer: true,
                };

                const testInstance = sinonTest(sinon, config);

                function testFunction() {
                    assert.equals(arguments.length, 0);
                    assert.isFunction(this.spy);
                    assert.isFunction(this.stub);
                    assert.isFunction(this.mock);
                    assert.fakeServer(this.server);
                    assert.isArray(this.requests);
                    assert.clock(this.clock);
                    assert.isUndefined(this.sandbox);
                }

                testInstance(testFunction).call({});
            },
        },

        "yields clock when faking timers"() {
            let clock;

            const config = {
                injectIntoThis: false,
                properties: ["clock"],
            };

            const testInstance = sinonTest(sinon, config);

            testInstance(function (c) {
                clock = c;
                assert.equals(arguments.length, 1);
            })();

            assert.clock(clock);
        },

        "fakes specified timers"() {
            let props;

            const config = {
                injectIntoThis: false,
                properties: ["clock"],
                useFakeTimers: {
                    toFake: ["Date", "setTimeout", "setImmediate"],
                },
            };

            const testInstance = sinonTest(sinon, config);

            testInstance((c) => {
                props = {
                    clock: c,
                    Date,
                    setTimeout,
                    clearTimeout,
                    // clear & setImmediate are not yet available in all environments
                    setImmediate:
                        typeof setImmediate !== "undefined"
                            ? setImmediate
                            : undefined,
                    clearImmediate:
                        typeof clearImmediate !== "undefined"
                            ? clearImmediate
                            : undefined,
                    setInterval,
                    clearInterval,
                };
            })();

            refute.same(props.Date, sinon.timers.Date);
            refute.same(props.setTimeout, sinon.timers.setTimeout);
            assert.same(props.clearTimeout, sinon.timers.clearTimeout);
            refute.same(props.setImmediate, sinon.timers.setImmediate);
            assert.same(props.clearImmediate, sinon.timers.clearImmediate);
            assert.same(props.setInterval, sinon.timers.setInterval);
            assert.same(props.clearInterval, sinon.timers.clearInterval);
        },

        "injects properties into test case"() {
            const testCase = {};

            const config = {
                properties: ["clock"],
            };

            const testInstance = sinonTest(sinon, config);

            function testFunction() {
                assert.same(this, testCase);
                assert.equals(arguments.length, 0);
                assert.clock(this.clock);
                assert.isUndefined(this.spy);
                assert.isUndefined(this.stub);
                assert.isUndefined(this.mock);
            }

            testInstance(testFunction).call(testCase);
        },

        "injects functions into test case by default"() {
            function testFunction() {
                assert.equals(arguments.length, 0);
                assert.isFunction(this.spy);
                assert.isFunction(this.stub);
                assert.isFunction(this.mock);
                assert.isObject(this.clock);
            }

            instance(testFunction).call({});
        },

        "injects sandbox"() {
            function testFunction() {
                assert.equals(arguments.length, 0);
                assert.isFunction(this.spy);
                assert.isObject(this.sandbox);
            }

            const config = {
                properties: ["sandbox", "spy"],
            };

            const testInstance = sinonTest(sinon, config);

            testInstance(testFunction).call({});
        },

        "remove injected properties afterwards"() {
            const testCase = {};

            // eslint-disable-next-line no-empty-function
            instance(() => {}).call(testCase);

            assert.isUndefined(testCase.spy);
            assert.isUndefined(testCase.stub);
            assert.isUndefined(testCase.mock);
            assert.isUndefined(testCase.sandbox);
            assert.isUndefined(testCase.clock);
            assert.isUndefined(testCase.server);
            assert.isUndefined(testCase.requests);
        },

        "uses test to fake time"() {
            const config = {
                useFakeTimers: true,
            };

            const testInstance = sinonTest(sinon, config);
            let called;

            const testCase = {
                test: testInstance(function () {
                    const spy = this.spy();
                    setTimeout(spy, 19);
                    this.clock.tick(19);

                    called = spy.called;
                }),
            };

            testCase.test();

            assert(called);
        },
    },
};
