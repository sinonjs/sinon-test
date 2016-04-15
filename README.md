# Sinon Test
> Test Framework helpers for SinonJS

## Help wanted
We could need a hand maintaining this project to enable us to focus on the core Sinon project. [Want to help us out](https://github.com/sinonjs/sinon-test/issues/12)? 

## Installation

via [npm (node package manager)](https://github.com/npm/npm)

    $ npm install sinon-test

## Usage

See the [sinon project homepage](http://sinonjs.org/) for documentation on usage.

`sinon-test` instances need to be configured with a `sinon` instance (version 2+) before they can be used; you can emulate the sinon 1.x methods with the following:

```js
var sinon = require('sinon');
var sinonTest = require('sinon-test');
var assert = require('assert');

sinon.test = sinonTest.configureTest(sinon);
sinon.testCase = sinonTest.configureTestCase(sinon);

describe('my function', function() { 
    var myFunc = require('./my-func');
    
    it('should do something', sinon.test(function(){
        var spy = this.spy(myFunc);
        myFunc(1);
        assert(spy.calledWith(1));
    })); //auto-cleanup
    
});

```
