'use strict';

const generator = require('../src/generator/log');
const onfStatic = require('onf-static');
const dumpDescribesVisitor = require('../src/visitor');

describe('dump_describes', () => {
    const dumpDescribes = onfStatic.makeTree;

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


    describe('nop', () => {
        const needle = 'No results found';

        beforeAll(() => {
            onfStatic.setOptions({
                useMap: true
            });

            dumpDescribesVisitor.setOptions({
                verbose: false
            });
        });

        it('should not return any results when given invalid code', done => {
            doHaystackTest('test/helper/bad_suite.js', needle, false, done);
        });

        it('should not return any results when given code with errors', done => {
            doHaystackTest('test/helper/evil_suite.js', needle, false, done);
        });

        it('should not return any results when given invalid input', done => {
            doHaystackTest('derp', needle, true, done);
        });

        it('should not return any results when given input with errors', done => {
            doHaystackTest('null.x', needle, true, done);
        });
    });
});

