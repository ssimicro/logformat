"use strict";

var _ = require('lodash');

function toString(str) {
    return _.has(str, 'toString') ? str.toString() : ''+str;
}

function applyQuotes(str) {
    return str.indexOf(' ') !== -1 ? '"' + str + '"' : str;
}

module.exports = function logformat(obj) {
    if (_.isString(obj)) {
        return obj;
    } else if (_.isNumber(obj)) {
        return toString(obj);
    } else if (_.isObject(obj)) {
        var r = [];
        _.each(obj, function (val, key) {
            if (_.isNull(val) || _.isUndefined(val)) {
                r.push(key + '=' + val);
            } else if (_.isObject(val)) {
                _.each(val, function (innerVal, innerKey) {
                    if (_.isNull(innerVal) || _.isUndefined(innerVal)) {
                        r.push(key + '.' + innerKey + '=' + innerVal);
                    } else if (!_.isFunction(innerVal)) {
                        r.push(key + '.' + innerKey + '=' + applyQuotes(toString(innerVal)));
                    }
                });
            } else if (!_.isFunction(val)) {
                r.push(key + '=' + applyQuotes(toString(val)));
            }
        });
        return r.join(' ');
    } else {
        return '';
    }
};
