"use strict";

const _ = require('lodash');
const moment = require('moment');
const flatten = require('flat');

function toString(str) {
    try {
        return _.has(str, 'toString') ? str.toString() : ''+str;
    } catch (err) {
        // some properties of mysql connection pools are objects that
        // cannot be converted to a primitive type using ''+str
        // mimic util.inspect() by simply returning an empty object string
        return '{}';
    }
}

function applyQuotes(str) {
    return str.indexOf(' ') !== -1 ? '"' + str + '"' : str;
}

module.exports = function logformat(obj, opts) {

    const flatOpts = { maxDepth: _.get(opts, 'maxDepth') };

    if (obj === null || obj === undefined) {
        return '';
    } else if (typeof obj !== 'object' || _.isRegExp(obj)) {
        return toString(obj);
    } else if (_.isDate(obj)) {
        return moment(obj).format();
    }

    try {
        obj = flatten(obj, flatOpts);               // flatten object
    } catch (err) {
        return '[Circular]';
    }

    obj = _.toPairs(obj);                       // convert to array of key/value pairs
    obj = obj.map((pair) => {                   // manipulate values for better output
        switch (true) {
            case _.isString(pair[1]):   pair[1] = applyQuotes(pair[1]);             break;
            case _.isDate(pair[1]):     pair[1] = moment(pair[1]).format();         break;
            default:                    pair[1] = applyQuotes(toString(pair[1]));   break;
        }
        return pair;
    });
    obj = obj.map((pair) => pair.join('='));    // join key/value pairs with equal sign
    obj = obj.join(' ');                        // join all pairs with space

    return obj;
};
