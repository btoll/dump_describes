'use strict';

const generator = require('../src/generator/log');
const onfStatic = require('onf-static');
const dumpDescribesVisitor = require('../src/visitor');

describe('dump_describes', () => {
    const dumpDescribes = onfStatic.makeTree;
    const transpiledSuiteName = 'test/helper/transpiled_suite.js';

    function doHaystackTest(suite, needle, isData, done) {
        dumpDescribes(suite, isData).then(data => {
            expect(data.indexOf(needle)).toBeGreaterThan(-1);
            done();
        });
    }

    beforeAll(() => {
        onfStatic.setDebugLevel('NONE');

        onfStatic.setOptions({
            generator: {
                log: generator
            },
            type: 'log',
            useMap: false,
            verbose: false,
            visitor: dumpDescribesVisitor.refs
        });

        dumpDescribesVisitor.setOptions({
            active: false,
            inactive: false,
            verbose: false
        });
    });

    // Note that these tests were added after seeing some suites transpiled into JavaScript.
    describe('when part of return statements', () => {
        const suite = "(() => { return describe('transpiled', () => { describe('when foo', () => { it('should derp', () => { expect(2 + 2).toBe(4); }); }); return describe('when bar', () => { it('should herp', () => { expect([1, 2, 4].length).toBe(3); }); return it('should double derp', () => { expect({}).not.toBe({}); }); }); }); });";

        describe('describe blocks', () => {
            const needle = 'when foo';

            beforeAll(() => {
                onfStatic.setOptions({
                    useMap: true,
                    verbose: false
                });

                dumpDescribesVisitor.setOptions({
                    verbose: false
                });
            });

            it('should work when returned from a block (file)', done => {
                doHaystackTest(transpiledSuiteName, needle, false, done);
            });

            it('should work when returned from a block (input)', done => {
                doHaystackTest(suite, 'when foo', true, done);
            });
        });

        describe('it blocks', () => {
            const needle = 'should double derp';

            beforeAll(() => {
                onfStatic.setOptions({
                    useMap: true,
                    verbose: true
                });

                dumpDescribesVisitor.setOptions({
                    verbose: true
                });
            });

            it('should work when returned from a block (file)', done => {
                doHaystackTest(transpiledSuiteName, needle, false, done);
            });

            it('should work when returned from a block (input)', done => {
                doHaystackTest(suite, needle, true, done);
            });
        });
    });
});

