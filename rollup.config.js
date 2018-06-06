"use strict";

var commonjs = require("rollup-plugin-commonjs");

module.exports = {
    input: "lib/index.js",
    output: {
        name: "sinonTest",
        format: "umd"
    },
    plugins: [
        commonjs({sourceMap: false})
    ]
};
