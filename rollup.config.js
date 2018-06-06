"use strict";

var commonjs = require("rollup-plugin-commonjs");

function createConfig(cfg) {
    return {
        input: "lib/index.js",
        output: {
            name: "sinonTest",
            file: cfg.file,
            format: cfg.format
        },
        plugins: [
            commonjs({sourceMap: false})
        ]
    };
}

module.exports = [
    createConfig({format: "umd", file: "dist/sinon-test.js"}),
    createConfig({format: "es", file: "dist/sinon-test-es.js"})
];
