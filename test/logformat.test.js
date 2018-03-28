"use strict";

var expect = require('expect.js');
var logformat = require('../');

describe('logformat', function () {
    it('should be defined as a function', function () {
        expect(logformat).not.to.be(undefined);
        expect(logformat).to.be.a('function');
    });
    it('should return a string when given a string', function () {
        expect(logformat('Hello, World!')).to.be('Hello, World!');
    });
    it('should return a string when given a number', function () {
        expect(logformat(42)).to.be('42');
    });
    it('should return an empty string when given null', function () {
        expect(logformat(null)).to.be('');
    });
    it('should return an empty string when given undefined', function () {
        expect(logformat(undefined)).to.be('');
    });
    it('should return a regular express as a string when given a RegExp', function () {
        expect(logformat(/^foobar$/)).to.be('/^foobar$/');
        expect(logformat(new RegExp("^foobar$"))).to.be('/^foobar$/');
    });
    it('should return true/false when given true/false', function () {
        var obj = { is_it_true: true };
        expect(logformat(obj.is_it_true)).to.be('true');
        expect(logformat(true)).to.be('true');
        expect(logformat(false)).to.be('false');
    });
    it('should return an ISO8601 formatted string when given a Date object', function () {
        expect(logformat(new Date('Tue Jun 21 2016 08:37:16 GMT-0400 (EDT)'))).to.be('2016-06-21T08:37:16-04:00');
        expect(logformat({ date: new Date('Tue Jun 21 2016 08:37:16 GMT-0400 (EDT)') })).to.be('date=2016-06-21T08:37:16-04:00');
    });
    it('should return a string of key=value pairs for objects', function () {
        expect(logformat({
            foo: undefined,                         // maps to foo=undefined
            bar: null,                              // maps to baz=null
            abc: true,                              // maps to abc=true
            def: 'Hello, World!',                   // maps to def="Hello, World!"
            ghi: 'cheese',                          // maps to ghi=cheese
            jkl: {
                a: null,                            // maps to jkl.a=null
                b: undefined,                       // maps to jkl.b=undefined
                c: 'howdy',                         // maps to jkl.c=howdy
                d: 'apple sauce',                   // maps to jkl.d="apple sauce"
                f: [ 4, 'life' ]
            },
            mno: [
                'this',                             // maps to mno.0=this
                'is',                               // maps to mno.1=is
                'a test'                            // maps to mno.2="a test"
            ],
            pqr: /^foobar$/                         // maps to pqr="/^foobar$/"
        })).to.be('foo=undefined bar=null abc=true def="Hello, World!" ghi=cheese jkl.a=null jkl.b=undefined jkl.c=howdy jkl.d="apple sauce" jkl.f.0=4 jkl.f.1=life mno.0=this mno.1=is mno.2="a test" pqr=/^foobar$/');
    });
    it('should return a string of key=value pairs for arrays', function () {
        expect(logformat([
            true,
            null,
            undefined,
            'test',
            'quoted test',
            42
        ])).to.be('0=true 1=null 2=undefined 3=test 4="quoted test" 5=42');
    });
});
