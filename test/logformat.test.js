"use strict";

const expect = require('expect.js');
const logformat = require('../');

describe('logformat', () => {
    it('should be defined as a function', () => {
        expect(logformat).not.to.be(undefined);
        expect(logformat).to.be.a('function');
    });
    it('should return a string when given a string', () => {
        expect(logformat('Hello, World!')).to.be('Hello, World!');
    });
    it('should format an Object which does not inherit from Object', () => {
        const obj = Object.create(null);
        obj.foo = 'bar';
        expect(logformat(obj)).to.be('foo=bar');

        const nested = { foo: Object.create(null) };
        nested.foo.bar = 'baz';
        expect(logformat(nested)).to.be('foo.bar=baz');

        const doubleNested = { foo: Object.create(null) };
        doubleNested.foo = { bar: Object.create(null) };
        doubleNested.foo.bar = 'baz';
        expect(logformat(doubleNested)).to.be('foo.bar=baz');
    });
    it('should return a string when given a number', () => {
        expect(logformat(42)).to.be('42');
    });
    it('should return an empty string when given null', () => {
        expect(logformat(null)).to.be('');
    });
    it('should return an empty string when given undefined', () => {
        expect(logformat(undefined)).to.be('');
    });
    it('should return a regular express as a string when given a RegExp', () => {
        expect(logformat(/^foobar$/)).to.be('/^foobar$/');
        expect(logformat(new RegExp("^foobar$"))).to.be('/^foobar$/');
    });
    it('should return true/false when given true/false', () => {
        var obj = { is_it_true: true };
        expect(logformat(obj.is_it_true)).to.be('true');
        expect(logformat(true)).to.be('true');
        expect(logformat(false)).to.be('false');
    });
    it('should return an ISO8601 formatted string when given a Date object', () => {
        expect(logformat(new Date('Tue Jun 21 2016 08:37:16 GMT-0400 (EDT)'))).to.be('2016-06-21T08:37:16-04:00');
        expect(logformat({ date: new Date('Tue Jun 21 2016 08:37:16 GMT-0400 (EDT)') })).to.be('date=2016-06-21T08:37:16-04:00');
    });
    it('should return a string of key=value pairs for objects', () => {
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
    it('should return a string of key=value pairs for arrays', () => {
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
