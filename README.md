# Sinon Test

Test Framework helpers for SinonJS

## Installation

via [npm (node package manager)](https://github.com/npm/npm)

    $ npm install sinon-test

## Usage

See the [sinon project homepage](http://sinonjs.org/) for documentation on usage.

`sinon-test` instances need to be configured with a `sinon` instance before they can be used, you can emulate the sinon 1.x methods with the following:

```js
var sinon = require('sinon');
var sinonTest = require('sinon-test');

sinon.test = sinonTest.configureTest(sinon);
sinon.testCase = sinonTest.configureTestCase(sinon);
```
