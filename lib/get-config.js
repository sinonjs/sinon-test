"use strict";

module.exports = function getConfig(defaultConfig, custom) {
    const config = {};
    let prop;

    const internalCustom = custom || {};

    for (prop in defaultConfig) {
        if (defaultConfig.hasOwnProperty(prop)) {
            config[prop] = internalCustom.hasOwnProperty(prop)
                ? internalCustom[prop]
                : defaultConfig[prop];
        }
    }

    return config;
};
