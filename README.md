# Sinon Test
> Test Framework helpers for SinonJS

## Help wanted
The core team of Sinon would like to focus on the core of Sinon, and so we are splitting out related helper functionality into separate packages such as this one. An

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
