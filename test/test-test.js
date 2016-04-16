"use strict";

var sinonTest = require("../");
var buster = require("buster");
var sinon = require("sinon");
var Promise = require("es6-promise").Promise;

var nextTick = buster.nextTick || require("buster-core").nextTick;
var assert = buster.assert;
var refute = buster.refute;

var instance = sinonTest.configureTest(sinon);

buster.testCase("sinon-test", {
    setUp: function () {
        this.boundTestCase = function () {
            var properties = {
                fn: function () {
                    properties.self = this;
                    properties.args = arguments;
                    properties.spy = this.spy;
                    properties.stub = this.stub;
                    properties.mock = this.mock;
                    properties.clock = this.clock;
                    properties.server = this.server;
                    properties.requests = this.requests;
                    properties.sandbox = this.sandbox;
                }
            };

            return properties;
        };
    },

    "throws if argument is not a function": function () {
        assert.exception(function () {
            instance({});
        });
    },

    "proxies return value": function () {
        var object = {};

        var result = instance(function () {
            return object;
        })();

        assert.same(result, object);
    },

    "stubs inside sandbox": function () {
        var method = function () {};
        var object = { method: method };

        instance(function () {
            this.stub(object, "method").returns(object);

            assert.same(object.method(), object);
        }).call({});
    },

    "restores stubs": function () {
        var method = function () {};
        var object = { method: method };

        instance(function () {
            this.stub(object, "method");
        }).call({});

        assert.same(object.method, method);
    },

    "restores stubs on all object methods": function () {
        var method = function () {};
        var method2 = function () {};
        var object = { method: method, method2: method2 };

        instance(function () {
            this.stub(object);
        }).call({});

        assert.same(object.method, method);
        assert.same(object.method2, method2);
    },

    "throws when method throws": function () {
        var method = function () {};
        var object = { method: method };

        assert.exception(function () {
            instance(function () {
                this.stub(object, "method");
                throw new Error();
            }).call({});
        }, "Error");
    },

    "throws when an async method throws": function () {
        var method = function () {};
        var object = { method: method };
        var fakeDone = function () {};

        assert.exception(function () {
            instance(function (done) { // eslint-disable-line no-unused-vars
                this.stub(object, "method");
                throw new Error();
            }).call({}, fakeDone);
        }, "Error");
    },

    "restores stub after promise resolves": function () {
        var object = {};

        var promise = instance(function () {
            return new Promise(function (resolve) {
                nextTick(function () { resolve(object); });
            });
        }).call({});

        return promise.then(function (result) {
            assert.same(result, object);
        });
    },

    "restores stub after promise is resolved": function () {
        var method = function () {};
        var object = { method: method };

        var promise = instance(function () {
            this.stub(object, "method");
            return new Promise(function (resolve) {
                nextTick(function () { resolve(object); });
            });
        }).call({});

        assert.equals(object.method === method, false);

        return promise.then(function () {
            assert.same(object.method, method);
        });
    },

    "restores stub after promise is rejected": function () {
        var method = function () {};
        var object = { method: method };

        var promise = instance(function () {
            this.stub(object, "method");
            return new Promise(function (_, reject) {
                nextTick(function () { reject(new Error()); });
            });
        }).call({});

        assert.equals(object.method === method, false);

        return promise.then(null, function (err) {
            assert.equals(err instanceof Error, true);
        });
    },

    "restores stub when method throws": function () {
        var method = function () {};
        var object = { method: method };

        try {
            instance(function () {
                this.stub(object, "method");
                throw new Error();
            }).call({});
        }

        catch (e) {} // eslint-disable-line no-empty

        assert.same(object.method, method);
    },

    "mocks inside sandbox": function () {
        var method = function () {};
        var object = { method: method };

        instance(function () {
            this.mock(object).expects("method").returns(object);

            assert.same(object.method(), object);
        }).call({});
    },

    "passes on errors to callbacks": function () {

        var fn = instance(function (callback) {
            callback(new Error("myerror"));
        });

        function errorChecker(err) {
            errorChecker.called = true;
            assert.equals(err instanceof Error, true);
        }

        fn(errorChecker);
        assert.equals(errorChecker.called, true);
    },

    "async test with sandbox": function (done) {
        var fakeDone = function (args) {
            assert.equals(args, undefined);
            done(args);
        };

        instance(function (callback) {
            nextTick(function () {
                callback();
            });
        }).call({}, fakeDone);
    },

    "async test with sandbox using mocha interface": function (done) {
        var it = function (title, fn) {
            var mochaDone = function (args) {
                assert.equals(args, undefined);
                done(args);
            };
            if (fn.length) {
                fn.call(this, mochaDone);
            } else {
                fn.call(this);
            }
        };

        it("works", instance(function (callback) {
            nextTick(function () {
                callback();
            });
        }));

    },

    "async test with sandbox using mocha interface throwing error": function (done) {
        var it = function (title, fn) {
            var mochaDone = function (args) {
                assert.equals(args, undefined);
                done(args);
            };
            if (fn.length) {
                fn.call(this, mochaDone);
            } else {
                fn.call(this);
            }
        };

        it("works", instance(function (callback) {
            callback();
        }));
    },

    "async test with sandbox and spy": function (done) {
        instance(function (callback) {
            var globalObj = {
                addOne: function (arg) {
                    return this.addOneInner(arg);
                },
                addOneInner: function (arg) {
                    return arg + 1;
                }
            };
            var addOneInnerSpy = this.spy();
            this.stub(globalObj, "addOneInner", addOneInnerSpy);

            nextTick(function () {
                globalObj.addOne(41);
                assert(addOneInnerSpy.calledOnce);
                callback();
            });
        }).call({}, done);
    },

    "async test preserves additional args and pass them in correct order": function (done) {
        instance(function (arg1, arg2, callback) {
            assert.equals(arg1, "arg1");
            assert.equals(typeof (arg2), "object");
            assert.equals(typeof (callback), "function");

            callback();
        }).call({}, "arg1", {}, done);
    },

    "verifies mocks": function () {
        var method = function () {};
        var object = { method: method };
        var exception;

        try {
            instance(function () {
                this.mock(object).expects("method").withExactArgs(1).once();
                object.method(42);
            }).call({});
        } catch (e) {
            exception = e;
        }

        assert.same(exception.name, "ExpectationError");
        assert.equals(exception.message,
                      "Unexpected call: method(42)\n" +
                      "    Expected method(1) once (never called)");
        assert.same(object.method, method);
    },

    "restores mocks": function () {
        var method = function () {};
        var object = { method: method };

        try {
            instance(function () {
                this.mock(object).expects("method");
            }).call({});
        }
        catch (e) {} // eslint-disable-line no-empty

        assert.same(object.method, method);
    },

    "restores mock when method throws": function () {
        var method = function () {};
        var object = { method: method };

        try {
            instance(function () {
                this.mock(object).expects("method").never();
                object.method();
            }).call({});
        }
        catch (e) {} // eslint-disable-line no-empty

        assert.same(object.method, method);
    },

    "appends helpers after normal arguments": function () {
        var object = { method: function () {} };
        var config = {
            injectIntoThis: false,
            properties: ["stub", "mock"]
        };

        var testInstance = sinonTest.configureTest(sinon, config);

        testInstance(function (obj, stub, mock) {
            mock(object).expects("method").once();
            object.method();

            assert.same(obj, object);
        })(object);
    },

    "maintains the this value": function () {
        var testCase = {
            someTest: instance(function () {
                return this;
            })
        };

        assert.same(testCase.someTest(), testCase);
    },

    "configurable test with sandbox": {
        "yields stub, mock as arguments": function () {
            var stubbed, mocked;
            var obj = { meth: function () {} };

            var config = {
                injectIntoThis: false,
                properties: ["stub", "mock"]
            };

            var testInstance = sinonTest.configureTest(sinon, config);

            testInstance(function (stub, mock) {
                stubbed = stub(obj, "meth");
                mocked = mock(obj);

                assert.equals(arguments.length, 2);
            })();

            assert.stub(stubbed);
            assert.mock(mocked);
        },

        "yields spy, stub, mock as arguments": function () {
            var spied, stubbed, mocked;
            var obj = { meth: function () {} };

            var config = {
                injectIntoThis: false,
                properties: ["spy", "stub", "mock"]
            };

            var testInstance = sinonTest.configureTest(sinon, config);

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

        "does not yield server when not faking xhr": function () {
            var stubbed, mocked;
            var obj = { meth: function () {} };

            var config = {
                injectIntoThis: false,
                properties: ["server", "stub", "mock"],
                useFakeServer: false
            };

            var testInstance = sinonTest.configureTest(sinon, config);

            testInstance(function (stub, mock) {
                stubbed = stub(obj, "meth");
                mocked = mock(obj);

                assert.equals(arguments.length, 2);
            })();

            assert.stub(stubbed);
            assert.mock(mocked);
        },

        "browser options": {
            requiresSupportFor: {
                "ajax/browser": typeof XMLHttpRequest !== "undefined" || typeof ActiveXObject !== "undefined"
            },

            "yields server when faking xhr": function () {
                var stubbed, mocked, server;
                var obj = { meth: function () {} };

                var config = {
                    injectIntoThis: false,
                    properties: ["server", "stub", "mock"]
                };

                var testInstance = sinonTest.configureTest(sinon, config);

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

            "uses serverWithClock when faking xhr": function () {
                var server;

                var config = {
                    injectIntoThis: false,
                    properties: ["server"],
                    useFakeServer: sinon.fakeServerWithClock
                };

                var testInstance = sinonTest.configureTest(sinon, config);

                testInstance(function (serv) {
                    server = serv;
                })();

                assert.fakeServer(server);
                assert(sinon.fakeServerWithClock.isPrototypeOf(server));
            },

            "injects properties into object": function () {
                var obj = {};

                var config = {
                    injectIntoThis: false,
                    injectInto: obj,
                    properties: ["server", "clock", "spy", "stub", "mock", "requests"]
                };

                var testInstance = sinonTest.configureTest(sinon, config);

                function testFunction() {
                    assert.equals(arguments.length, 0);
                    refute.defined(this.server);
                    refute.defined(this.clock);
                    refute.defined(this.spy);
                    refute.defined(this.stub);
                    refute.defined(this.mock);
                    refute.defined(this.requests);
                    assert.fakeServer(obj.server);
                    assert.clock(obj.clock);
                    assert.isFunction(obj.spy);
                    assert.isFunction(obj.stub);
                    assert.isFunction(obj.mock);
                    assert.isArray(obj.requests);
                }

                testInstance(testFunction).call({});
            },

            "injects server and clock when only enabling them": function () {
                var config = {
                    useFakeTimers: true,
                    useFakeServer: true
                };

                var testInstance = sinonTest.configureTest(sinon, config);

                function testFunction() {
                    assert.equals(arguments.length, 0);
                    assert.isFunction(this.spy);
                    assert.isFunction(this.stub);
                    assert.isFunction(this.mock);
                    assert.fakeServer(this.server);
                    assert.isArray(this.requests);
                    assert.clock(this.clock);
                    refute.defined(this.sandbox);
                }

                testInstance(testFunction).call({});
            }
        },

        "yields clock when faking timers": function () {
            var clock;

            var config = {
                injectIntoThis: false,
                properties: ["clock"]
            };

            var testInstance = sinonTest.configureTest(sinon, config);

            testInstance(function (c) {
                clock = c;
                assert.equals(arguments.length, 1);
            })();

            assert.clock(clock);
        },

        "fakes specified timers": function () {
            var props;

            var config = {
                injectIntoThis: false,
                properties: ["clock"],
                useFakeTimers: ["Date", "setTimeout", "setImmediate"]
            };

            var testInstance = sinonTest.configureTest(sinon, config);

            testInstance(function (c) {
                props = {
                    clock: c,
                    Date: Date,
                    setTimeout: setTimeout,
                    clearTimeout: clearTimeout,
                    // clear & setImmediate are not yet available in all environments
                    setImmediate: (typeof setImmediate !== "undefined" ? setImmediate : undefined),
                    clearImmediate: (typeof clearImmediate !== "undefined" ? clearImmediate : undefined),
                    setInterval: setInterval,
                    clearInterval: clearInterval
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

        "injects properties into test case": function () {
            var testCase = {};

            var config = {
                properties: ["clock"]
            };

            var testInstance = sinonTest.configureTest(sinon, config);

            function testFunction() {
                assert.same(this, testCase);
                assert.equals(arguments.length, 0);
                assert.clock(this.clock);
                refute.defined(this.spy);
                refute.defined(this.stub);
                refute.defined(this.mock);
            }

            testInstance(testFunction).call(testCase);
        },

        "injects functions into test case by default": function () {
            function testFunction() {
                assert.equals(arguments.length, 0);
                assert.isFunction(this.spy);
                assert.isFunction(this.stub);
                assert.isFunction(this.mock);
                assert.isObject(this.clock);
            }

            instance(testFunction).call({});
        },

        "injects sandbox": function () {
            function testFunction() {
                assert.equals(arguments.length, 0);
                assert.isFunction(this.spy);
                assert.isObject(this.sandbox);
            }

            var config = {
                properties: ["sandbox", "spy"]
            };

            var testInstance = sinonTest.configureTest(sinon, config);

            testInstance(testFunction).call({});
        },

        "remove injected properties afterwards": function () {
            var testCase = {};

            instance(function () {}).call(testCase);

            refute.defined(testCase.spy);
            refute.defined(testCase.stub);
            refute.defined(testCase.mock);
            refute.defined(testCase.sandbox);
            refute.defined(testCase.clock);
            refute.defined(testCase.server);
            refute.defined(testCase.requests);
        },

        "uses test to fake time": function () {
            var config = {
                useFakeTimers: true
            };

            var testInstance = sinonTest.configureTest(sinon, config);
            var called;

            var testCase = {
                test: testInstance(function () {
                    var spy = this.spy();
                    setTimeout(spy, 19);
                    this.clock.tick(19);

                    called = spy.called;
                })
            };

            testCase.test();

            assert(called);
        }
    }
});
