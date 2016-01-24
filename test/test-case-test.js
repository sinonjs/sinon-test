"use strict";

var buster = require("buster");
/*
var sinon = root.sinon || require("sinon");
var sinonTest = root.sinonTest || require("../lib/test");
var sinonTestCase = root.sinonTest && root.sinonTest.testCase || require("../lib/test_case");
var assert = buster.assert;
var refute = buster.refute;
*/

buster.testCase("sinon-test.testCase", {
    /*
    "throws without argument": function () {
        assert.exception(function () {
            sinonTestCase();
        }, "TypeError");
    },

    "throws without object": function () {
        assert.exception(function () {
            sinonTestCase(function () {});
        }, "TypeError");
    },

    "only wraps functions with test prefix": sinonTest(function () {
        this.spy(obj, "test");

        var testc = {
            testA: function () {},
            doB: function () {}
        };

        sinonTestCase(testc);

        assert.isFunction(testc.doB);
        assert(sinon.test.calledWith(testc.testA));
        assert.isFalse(sinon.test.calledWith(testc.doB));
    }),

    "removes setUp method": function () {
        var test = { setUp: function () {} };
        var result = sinonTestCase(test);

        refute.defined(result.setUp);
        refute.defined(result["test setUp"]);
    },

    "removes tearDown method": function () {
        var test = { tearDown: function () {} };
        var result = sinonTestCase(test);

        refute.defined(result.tearDown);
        refute.defined(result["test tearDown"]);
    },

    "calls setUp before any test": function () {
        var test = { setUp: sinon.stub(), test: sinon.stub(), test2: sinon.stub() };
        var result = sinonTestCase(test);
        result.test();
        result.test2();

        assert.equals(test.setUp.callCount, 2);
        sinon.assert.called(test.test);
        sinon.assert.called(test.test2);
    },

    "calls tearDown after any test": function () {
        var test = { tearDown: sinon.stub(), test: sinon.stub(), test2: sinon.stub() };
        var result = sinonTestCase(test);
        result.test();
        result.test2();

        refute.exception(function () {
            sinon.assert.called(test.tearDown);
            sinon.assert.called(test.test);
            sinon.assert.called(test.test2);
        });
    },

    "calls tearDown even if test throws": function () {
        var test = { tearDown: sinon.stub(), test: sinon.stub().throws() };
        var result = sinonTestCase(test);

        assert.exception(function () {
            result.test();
        }, "Error");

        sinon.assert.called(test.tearDown);
        sinon.assert.called(test.test);
    },

    "calls setUp test tearDown in order": function () {
        var testCase = {
            setUp: sinon.stub(),
            test: sinon.stub(),
            tearDown: sinon.stub()
        };

        var result = sinonTestCase(testCase);

        try {
            result.test();
        }
        catch (e) {} // eslint-disable-line no-empty

        refute.exception(function () {
            sinon.assert.callOrder(testCase.setUp, testCase.test, testCase.tearDown);
        });
    },

    "calls in order when test throws": function () {
        var testCase = {
            setUp: sinon.stub(),
            tearDown: sinon.stub(),
            test: sinon.stub().throws()
        };

        var result = sinonTestCase(testCase);

        try {
            result.test();
        }
        catch (e) {} // eslint-disable-line no-empty

        refute.exception(function () {
            sinon.assert.callOrder(testCase.setUp, testCase.test, testCase.tearDown);
        });
    },

    "unstubs objects after test is run": function () {
        var myMeth = function () {};
        var myObj = { meth: myMeth };

        var testCase = sinonTestCase({
            testA: function () {
                this.stub(myObj, "meth");

                assert.isFunction(this.stub);
                refute.same(myObj.meth, myMeth);
            }
        });

        testCase.testA();

        assert.same(myObj.meth, myMeth);
    },

    "unstubs all methods of an objects after test is run": function () {
        var myMeth = function () {};
        var myMeth2 = function () {};
        var myObj = { meth: myMeth, meth2: myMeth2 };

        var testCase = sinonTestCase({
            testA: function () {
                this.stub(myObj);

                assert.isFunction(this.stub);

                refute.same(myObj.meth, myMeth);
                refute.same(myObj.meth2, myMeth2);
            }
        });

        testCase.testA();

        assert.same(myObj.meth, myMeth);
        assert.same(myObj.meth2, myMeth2);
    },

    "unstubs objects stubbed in setUp": function () {
        var myMeth = function () {};
        var myObj = { meth: myMeth };

        var testCase = sinonTestCase({
            setUp: function () {
                this.stub(myObj, "meth");
            },

            testA: function () {
                assert.isFunction(this.stub);
                refute.same(myObj.meth, myMeth);
            }
        });

        testCase.testA();

        assert.same(myObj.meth, myMeth);
    },

    "unstubs all methods of an objects stubbed in setUp": function () {
        var myMeth = function () {};
        var myMeth2 = function () {};
        var myObj = { meth: myMeth, meth2: myMeth2 };

        var testCase = sinonTestCase({
            setUp: function () {
                this.stub(myObj);
            },
            testA: function () {
                assert.isFunction(this.stub);

                refute.same(myObj.meth, myMeth);
                refute.same(myObj.meth2, myMeth2);
            }
        });

        testCase.testA();

        assert.same(myObj.meth, myMeth);
        assert.same(myObj.meth2, myMeth2);
    },

    "allows the use of helper methods": function () {
        var helper = sinon.spy();

        var testC = sinonTestCase({
            doIt: helper,

            testIt: function () {
                this.doIt();
            }
        });

        refute.exception(function () {
            testC.testIt();
        });

        assert(helper.calledOnce);
        assert(helper.calledOn(testC));
    },

    "returns result of test function": function () {
        var testC = sinonTestCase({
            testIt: sinon.stub().returns(42)
        });

        assert.equals(testC.testIt(), 42);
    },

    "returns result of test function with setUp": function () {
        var testC = sinonTestCase({
            setUp: sinon.spy(),
            testIt: sinon.stub().returns(42)
        });

        assert.equals(testC.testIt(), 42);
    },

    "returns result of test function with setUp and teardown": function () {
        var testC = sinonTestCase({
            setUp: sinon.spy(),
            tearDown: sinon.spy(),
            testIt: sinon.stub().returns(42)
        });

        assert.equals(testC.testIt(), 42);
    }
    */
});


