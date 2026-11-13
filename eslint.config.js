"use strict";

const sinonConfig = require("@sinonjs/eslint-config");

module.exports = [
    {
        ignores: [
            "eslint.config.js",
            "coverage/**",
            "dist/**",
            // fragments concatenated into test files by do-test.sh
            "test-repos/**",
        ],
    },
    ...sinonConfig,
];
