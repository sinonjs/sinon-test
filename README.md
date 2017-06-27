# Sinon Test
> Automatic sandbox setup and teardown for SinonJS

## Why?
Instead of writing tedious setup and teardown code for each
individual test case you can let Sinon do all the cleanup for you.

So instead of doing this (using [Mocha](https://mochajs.org/) syntax):

```javascript
var spy1;
var spy2;

afterEach(()=>{
    spy1.restore();
    spy2.restore();
});

it('should do something', ()=>{
    spy1 = sinon.spy(myFunc);
    spy2 = sinon.spy(myOtherFunc);
    myFunc(1);
    myFunc(2);
    assert(spy1.calledWith(1));
    assert(spy1.calledWith(2));
});
```

You could write just this

```javascript
it('should do something', sinon.test(function(){
    var spy1 = this.spy(myFunc);
    var spy2 = this.spy(myOtherFunc);
    myFunc(1);
    myFunc(2);
    assert(spy1.calledWith(1));
    assert(spy1.calledWith(2));
})); //auto-cleanup
```

Sinon will take care of removing all the spies and stubs
from the wrapped functions for you. It does this by using
`sinon.sandbox` internally.

Do notice that
we use a `function` and not a arrow function (ES2015)
when wrapping the test with `sinon.test` as it needs
to be able to access the `this` pointer used inside
of the function.

See the [Usage](#usage) section for more details.

## Installation

via [npm (node package manager)](https://github.com/npm/npm)

    $ npm install sinon-test

or just add it as a `<script src="dist/sinon-test.js"></script>`
tag to the html where you write your tests. A pre-built browser
version can be found in the NPM package under `dist/sinon-test.js`.

## Usage

Once initialized, the package creates a context for your test based on a sinon sandbox.
You can use `this` in a wrapped test function to create sinon spies, stubs, etc.
After your test completes, the sandbox restores anything modified to its original value.

If your test function takes any arguments, pass then to the `test` wrapper
after the test function. If the last argument is a function, it is assumed to be a callback
for an asynchronous test. The test function may also return a promise.

See the [sinon documentation](http://sinonjs.org/) for more documentation on sandboxes.

`sinon-test` instances need to be configured with a `sinon` instance (version 2+)
before they can be used.

```js
var sinon = require('sinon');
var sinonTest = require('sinon-test');
var assert = require('assert');

sinon.test = sinonTest(sinon);

describe('my function', function() {
    var myFunc = require('./my-func');

    it('should do something', sinon.test(function(){
        var spy = this.spy(myFunc);
        myFunc(1);
        assert(spy.calledWith(1));
    })); //auto-cleanup

});

```
In order to configure with options, a configuration hash can be passed as a 2nd argument to `sinonTest`:

```js
sinon.test = sinonTest(sinon, {useFakeTimers: false});
```

