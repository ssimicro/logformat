"use strict";

const _ = require('lodash');
const moment = require('moment');
const flatten = require('flat');
const traverse = require('traverse');

function toString(str) {
    try {
        if (_.isArray(str) && _.isEmpty(str)) {
            return  "[]";
        }
        if (_.isPlainObject(str) && _.isEmpty(str)) {
            return  "{}";
        }
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

// Error objects have a lot of hidden (non-enumerable) properties that we want to include in the formatted log message (e.g. name, message, etc)
function unhideErrorProperties(err) {
    return _.extend(
        Object.create(Object.getPrototypeOf(err)),
        err,
        _.pick(err, [ 'name', 'message', 'description', 'number', 'fileName', 'lineNumber', 'columnNumber', ])
    );
}

module.exports = function logformat(obj, opts) {

    const prefix = _.isError(obj) ? 'ERROR ' : ''; // prefix log message with ERROR when formatting a top level error
    const flatOpts = { maxDepth: _.get(opts, 'maxDepth') };

    if (_.isError(obj)) {   // expose hidden properties such as name and message
        obj = unhideErrorProperties(obj);
    }

    traverse(obj).forEach(function (x) {    // find errors and expose hidden properties such as name and message
        if (_.isError(x)) {
            this.update(unhideErrorProperties(x));
        }
    });

    if (obj === null || obj === undefined) {
        return '';
    } else if (_.isArray(obj) && _.isEmpty(obj)) {
        return  "[]";
    } else if (_.isPlainObject(obj) && _.isEmpty(obj)) {
        return  "{}";
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

    return `${prefix}${obj}`;
};
