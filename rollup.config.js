"use strict";

var commonjs = require("rollup-plugin-commonjs");

module.exports = {
    entry: "lib/index.js",
    format: "umd",
    moduleName: "sinonTest",
    plugins: [
        commonjs({sourceMap: false})
    ]
};
