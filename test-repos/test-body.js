/* eslint-disable */
var sinonTest = sinonTestFactory(sinon);

var testFramework = {
    "the usual suspects should be present": sinonTest(
        function myTestFunction() {
            ["stub", "spy", "mock"].forEach(function(func) {
                assert.equal(typeof this[func], "function");
            }, this);
            ["clock", "server"].forEach(function(name) {
                assert.equal(typeof this[name], "object");
            }, this);
        }
    ),
    "basic functionality should work": sinonTest(function myTestFunction() {
        assert.equal(this.stub().returns(42)(), 42);
    })
};

for (var test in testFramework) testFramework[test].call(testFramework);
