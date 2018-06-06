"use strict";

const expect = require('expect.js');
const isIsoDate = require('is-isodate');
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
    it('should return an empty string when given an empty string', () => {
        expect(logformat("")).to.be('');
    });
    it('should return an empty array as string when given an empty array', () => {
        expect(logformat([])).to.be('[]');
    });
    it('should return an empty object as string when given an empty object', () => {
        expect(logformat({})).to.be('{}');
    });
    it('should return a key=[] when given an empty array value', () => {
        expect(logformat({x: []})).to.be('x=[]');
    });
    it('should return a key={} when given an empty object value', () => {
        expect(logformat({x: {}})).to.be('x={}');
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
        const date = new Date('Tue Jun 21 2016 08:37:16 GMT-0400 (EDT)');
        expect(isIsoDate(logformat(date))).to.be(true);
        expect(isIsoDate(logformat({ date: date }).split('=')[1])).to.be(true);
    });
    it('should return a string when given an Error object', function () {
        var err = new Error('Test');
        err.name = 'logformat.test.err';
        expect(logformat(err)).to.be('ERROR name=logformat.test.err message=Test');
        expect(logformat({ err: err })).to.be('err.name=logformat.test.err err.message=Test');
    });
    it('should not significantly modify its input', function () {
        // we're most concerned about the magic we do to make error objects format properly
        // we don't want to change the type (i.e. lose the Error-ness of error objects).

        const err = new Error('Test');
        logformat(err);
        expect(err).to.be.an(Error);

        const nested = { err: new Error('Test Nested') };
        logformat(nested);
        expect(nested.err).to.be.an(Error);

        const doubleNested = { err: new Error('Test Double Nested Outer') };
        doubleNested.err.inner = new Error('Test Double Nested Inner');
        logformat(doubleNested);
        expect(doubleNested.err).to.be.an(Error);
        expect(doubleNested.err.inner).to.be.an(Error);
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
                f: [ 4, 'life' ],
                g: {}                               // maps to jkl.g={}
            },
            mno: [
                'this',                             // maps to mno.0=this
                'is',                               // maps to mno.1=is
                'a test'                            // maps to mno.2="a test"
            ],
            pqr: /^foobar$/,                        // maps to pqr="/^foobar$/"
            stu: []                                 // maps to stu=[]
        })).to.be('foo=undefined bar=null abc=true def="Hello, World!" ghi=cheese jkl.a=null jkl.b=undefined jkl.c=howdy jkl.d="apple sauce" jkl.f.0=4 jkl.f.1=life jkl.g={} mno.0=this mno.1=is mno.2="a test" pqr=/^foobar$/ stu=[]');
    });
    it('should return a string of key=value pairs for arrays', () => {
        expect(logformat([
            true,
            null,
            undefined,
            'test',
            'quoted test',
            42,
            [],
            {},
        ])).to.be('0=true 1=null 2=undefined 3=test 4="quoted test" 5=42 6=[] 7={}');
    });
    it('should respect maxDepth option', () => {
        const obj = { foo: { bar: { baz: 1} } };
        expect(logformat(obj, { maxDepth: 2 })).to.be('foo.bar="[object Object]"');
        expect(logformat(obj, { maxDepth: 10 })).to.be('foo.bar.baz=1');
        expect(logformat(obj)).to.be('foo.bar.baz=1');
    });
    it('should not crash on a circular reference', () => {
        const a = {};
        const b = {};
        a.b = b;
        b.a = a;
        expect(logformat(a)).to.be('[Circular]');
    });
});
