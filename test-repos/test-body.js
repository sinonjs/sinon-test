/* eslint-disable */
var sinonTest = sinonTestFactory(sinon);

var testFramework = {
    "the usual suspects should be present": sinonTest(
        function myTestFunction() {
            ["stub", "spy", "mock"].forEach(function(func) {
                assert.equal(typeof this[func], "function");
            }, this);
            // Sinon 20 removed the fake server, so only expect it when it exists
            var fakes = sinon.fakeServer ? ["clock", "server"] : ["clock"];
            fakes.forEach(function(name) {
                assert.equal(typeof this[name], "object");
            }, this);
        }
    ),
    "basic functionality should work": sinonTest(function myTestFunction() {
        assert.equal(this.stub().returns(42)(), 42);
    })
};

for (var test in testFramework) testFramework[test].call(testFramework);
