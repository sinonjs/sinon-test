"use strict";

module.exports = function getConfig(defaultConfig, custom) {
    var config = {};
    var prop;

    custom = custom || {};

    for (prop in defaultConfig) {
        if (defaultConfig.hasOwnProperty(prop)) {
            config[prop] = custom.hasOwnProperty(prop) ? custom[prop] : defaultConfig[prop];
        }
    }

    return config;
};
