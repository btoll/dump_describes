'use strict';

const generator = require('../src/generator/log');
const onfStatic = require('onf-static');
const dumpDescribesVisitor = require('../src/visitor');

describe('dump_describes', () => {
    const dumpDescribes = onfStatic.makeTree;
    const basicSuiteName = 'test/helper/basic_suite.js';

    let mock;

    function setupMockSpy(done) {
        mock = {
            f: () => {
                expect(mock.f).toHaveBeenCalled();
                done();
            }
        };

        spyOn(mock, 'f').and.callThrough();
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

    describe('when given input from `stdin`', () => {
        beforeAll(() =>
            onfStatic.setOptions({
                useMap: true
            })
        );

        describe('bad input', () => {
            xit('should throw if given a non-existent file', done => {
                setupMockSpy(done);
                dumpDescribes('fakeFile', true).catch(mock.f);
            });

            it('should throw if given bad input', done => {
                setupMockSpy(done);
                dumpDescribes('this is not a test suite', true).catch(mock.f);
            });
        });

        describe('good input', () => {
            it('should succeed when given an existing file', done => {
                setupMockSpy(done);
                dumpDescribes(basicSuiteName, true).then(mock.f);
            });

            it('should succeed when given good input', done => {
                setupMockSpy(done);
                dumpDescribes('describe("foo", () => {});', true, null, true).then(mock.f);
            });
        });
    });
});

