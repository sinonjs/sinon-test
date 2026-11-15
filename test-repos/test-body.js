/* eslint-disable */
var sinonTest = sinonTestFactory(sinon);

var testFramework = {
    "the usual suspects should be present": sinonTest(
        function myTestFunction() {
            ["stub", "spy", "mock"].forEach(function(func) {
                assert.equal(typeof this[func], "function");
            }, this);
            assert.equal(typeof this.clock, "object");
        }
    ),
    "basic functionality should work": sinonTest(function myTestFunction() {
        assert.equal(this.stub().returns(42)(), 42);
    })
};

for (var test in testFramework) testFramework[test].call(testFramework);

// the sandbox properties are removed from the test context afterwards
assert.equal(typeof testFramework.spy, "undefined");
assert.equal(typeof testFramework.clock, "undefined");
