"use strict";

module.exports = function getConfig(defaultConfig, custom) {
    var config = {};
    var prop;

    var internalCustom = custom || {};

    for (prop in defaultConfig) {
        if (defaultConfig.hasOwnProperty(prop)) {
            config[prop] = internalCustom.hasOwnProperty(prop)
                ? internalCustom[prop]
                : defaultConfig[prop];
        }
    }

    return config;
};
