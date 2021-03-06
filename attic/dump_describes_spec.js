'use strict';

const generator = require('../src/generator/log');
const onfStatic = require('onf-static');
const dumpDescribesVisitor = require('../src/visitor');

const testStrings = require('./test/strings');
const testSuites = require('./test/suites');

describe('dump_describes', () => {
    const dumpDescribes = onfStatic.makeTree;
    const basicSuiteName = 'spec/test/basic_suite.js';
    const transpiledSuiteName = 'spec/test/transpiled_suite.js';

    let mock;

    function doHaystackTest(suite, needle, isData, done) {
        dumpDescribes(suite, isData).then(data => {
            expect(data.indexOf(needle)).toBeGreaterThan(-1);
            done();
        });
    }

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

    describe('making a suite', () => {
        it('should return a promise', () => {
            expect(dumpDescribes(basicSuiteName) instanceof Promise).toBe(true);
        });

        it('should throw if not given a file', () => {
            expect(() => {
                dumpDescribes();
            }).toThrow();
        });

        describe('configuration', () => {
            describe('onf-static options', () => {
                it('should use the specified generator', () => {
                    expect(onfStatic.getOptions().generator.log).toEqual(generator);
                });

                it('should use the specified visitor', () => {
                    expect(onfStatic.getOptions().visitor).toEqual(dumpDescribesVisitor.refs);
                });

                xit('should not throw if not given a generator or visitor (will use the defaults)', () => {
                    expect(() => {
                        dumpDescribes(basicSuiteName, false);
                    }).not.toThrow();
                });
            });

            describe('visitor options', () => {
                function testVisitorOptions(prop) {
                    it('should be off by default', () => {
                        expect(dumpDescribesVisitor.getOptions()[prop]).toBe(false);
                    });

                    it('should be `true` when set', () => {
                        dumpDescribesVisitor.setOptions({
                            [prop]: true
                        });

                        expect(dumpDescribesVisitor.getOptions()[prop]).toBe(true);
                    });
                }

                describe('active', () => {
                    testVisitorOptions('active');
                });

                describe('inactive', () => {
                    testVisitorOptions('inactive');
                });

                describe('verbose', () => {
                    testVisitorOptions('verbose');
                });
            });
        });

        xdescribe('when given input', () => {
            beforeAll(() =>
                onfStatic.setOptions({
                    useMap: true
                })
            );

            describe('bad input', () => {
                xit('should throw if given a non-existent file', done => {
                    setupMockSpy(done);
                    dumpDescribes('fakeFile', generator).catch(mock.f);
                });

                it('should throw if given bad input', done => {
                    setupMockSpy(done);
                    dumpDescribes('this is not a test suite', generator, null, true).catch(mock.f);
                });
            });

            describe('good input', () => {
                it('should succeed when given an existing file', done => {
                    setupMockSpy(done);
                    dumpDescribes(basicSuiteName, generator).then(mock.f);
                });

                it('should succeed when given good input', done => {
                    setupMockSpy(done);
                    dumpDescribes('describe("foo", () => {});', generator, null, true).then(mock.f);
                });
            });
        });

        describe('no-ops', () => {
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
                doHaystackTest('spec/test/bad_suite.js', needle, false, done);
            });

            it('should not return any results when given code with errors', done => {
                doHaystackTest('spec/test/evil_suite.js', needle, false, done);
            });

            it('should not return any results when given invalid input', done => {
                doHaystackTest('derp', needle, true, done);
            });

            it('should not return any results when given input with errors', done => {
                doHaystackTest('null.x', needle, true, done);
            });
        });

        // Note that these tests were added after seeing some suites transpiled into JavaScript.
        xdescribe('when part of return statements', () => {
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

        xdescribe('suite and spec titles', () => {
            describe('describe blocks', () => {
                beforeAll(() => {
                    onfStatic.setOptions({
                        useMap: true
                    });

                    dumpDescribesVisitor.setOptions({
                        verbose: false
                    });
                });

                describe('ArrowFunctionExpression', () => {
                    const arrowFunctionExpressionString = testStrings.arrowFunctionExpression;

                    it('should have file support', done => {
                        doHaystackTest(basicSuiteName, arrowFunctionExpressionString, false, done);
                    });

                    it('should have input support', done => {
                        doHaystackTest(testSuites.describe.arrowFunctionExpression, arrowFunctionExpressionString, true, done);
                    });
                });

                describe('AssignmentExpression', () => {
                    const assignmentExpressionString = testStrings.assignmentExpression;

                    it('should have file support', done => {
                        doHaystackTest(basicSuiteName, assignmentExpressionString, false, done);
                    });

                    it('should have input support', done => {
                        doHaystackTest(testSuites.describe.assignmentExpression, assignmentExpressionString, true, done);
                    });
                });

                describe('BinaryExpression', () => {
                    const binaryExpressionString = testStrings.binaryExpression;

                    it('should have file support', done => {
                        doHaystackTest(basicSuiteName, binaryExpressionString, false, done);
                    });

                    it('should have input support', done => {
                        doHaystackTest(testSuites.describe.binaryExpression, binaryExpressionString, true, done);
                    });
                });

                describe('CallExpression', () => {
                    const callExpressionString = testStrings.callExpression;

                    it('should have file support', done => {
                        doHaystackTest(basicSuiteName, callExpressionString, false, done);
                    });

                    it('should have input support', done => {
                        doHaystackTest(testSuites.describe.callExpression, callExpressionString, true, done);
                    });
                });

                describe('ConditionalExpression', () => {
                    const conditionalExpressionString = testStrings.conditionalExpression;

                    it('should have file support', done => {
                        doHaystackTest(basicSuiteName, conditionalExpressionString, false, done);
                    });

                    it('should have input support', done => {
                        doHaystackTest(testSuites.describe.conditionalExpression, conditionalExpressionString, true, done);
                    });
                });

                describe('FunctionExpression', () => {
                    const functionExpressionString = testStrings.functionExpression;

                    it('should have file support', done => {
                        doHaystackTest(basicSuiteName, functionExpressionString, false, done);
                    });

                    it('should have input support', done => {
                        doHaystackTest(testSuites.describe.functionExpression, functionExpressionString, true, done);
                    });
                });

                describe('MemberExpression', () => {
                    const memberExpressionString = testStrings.memberExpression;

                    it('should have file support', done => {
                        doHaystackTest(basicSuiteName, memberExpressionString, false, done);
                    });

                    it('should have input support', done => {
                        doHaystackTest(testSuites.describe.memberExpression, memberExpressionString, true, done);
                    });
                });

                describe('TemplateLiteral', () => {
                    const templateLiteralString = testStrings.templateLiteral;

                    it('should have file support', done => {
                        doHaystackTest(basicSuiteName, templateLiteralString, false, done);
                    });

                    it('should have input support', done => {
                        doHaystackTest(testSuites.describe.templateLiteral, templateLiteralString, true, done);
                    });
                });

                describe('UnaryExpression', () => {
                    const unaryExpressionString = testStrings.unaryExpression;

                    it('should have file support', done => {
                        doHaystackTest(basicSuiteName, unaryExpressionString, false, done);
                    });

                    it('should have file support', done => {
                        doHaystackTest(testSuites.describe.unaryExpression, unaryExpressionString, true, done);
                    });
                });
            });

            xdescribe('it blocks', () => {
                beforeAll(() => {
                    onfStatic.setOptions({
                        useMap: true
                    });

                    dumpDescribesVisitor.setOptions({
                        verbose: true
                    });
                });

                describe('ArrowFunctionExpression', () => {
                    const arrowFunctionExpressionString = testStrings.arrowFunctionExpression;

                    it('should have file support', done => {
                        doHaystackTest(basicSuiteName, arrowFunctionExpressionString, false, done);
                    });

                    xit('should have input support', done => {
                        doHaystackTest(testSuites.it.arrowFunctionExpression, arrowFunctionExpressionString, true, done);
                    });
                });

                describe('AssignmentExpression', () => {
                    const assignmentExpressionString = testStrings.assignmentExpression;

                    it('should have file support', done => {
                        doHaystackTest(basicSuiteName, assignmentExpressionString, false, done);
                    });

                    xit('should have input support', done => {
                        doHaystackTest(testSuites.it.assignmentExpression, assignmentExpressionString, true, done);
                    });
                });

                describe('BinaryExpression', () => {
                    const binaryExpressionString = testStrings.binaryExpression;

                    it('should have file support', done => {
                        doHaystackTest(basicSuiteName, binaryExpressionString, false, done);
                    });

                    xit('should have input support', done => {
                        doHaystackTest(testSuites.it.binaryExpression, binaryExpressionString, true, done);
                    });
                });

                describe('CallExpression', () => {
                    const callExpressionString = testStrings.callExpression;

                    it('should have file support', done => {
                        doHaystackTest(basicSuiteName, callExpressionString, false, done);
                    });

                    xit('should have input support', done => {
                        doHaystackTest(testSuites.it.callExpression, callExpressionString, true, done);
                    });
                });

                describe('ConditionalExpression', () => {
                    const conditionalExpressionString = testStrings.conditionalExpression;

                    it('should have file support', done => {
                        doHaystackTest(basicSuiteName, conditionalExpressionString, false, done);
                    });

                    xit('should have input support', done => {
                        doHaystackTest(testSuites.it.conditionalExpression, conditionalExpressionString, true, done);
                    });
                });

                describe('FunctionExpression', () => {
                    const functionExpressionString = testStrings.functionExpression;

                    it('should have file support', done => {
                        doHaystackTest(basicSuiteName, functionExpressionString, false, done);
                    });

                    xit('should have input support', done => {
                        doHaystackTest(testSuites.it.functionExpression, functionExpressionString, true, done);
                    });
                });

                describe('MemberExpression', () => {
                    const memberExpressionString = testStrings.memberExpression;

                    it('should have file support', done => {
                        doHaystackTest(basicSuiteName, memberExpressionString, false, done);
                    });

                    xit('should have input support', done => {
                        doHaystackTest(testSuites.it.memberExpression, memberExpressionString, true, done);
                    });
                });

                describe('TemplateLiteral', () => {
                    const templateLiteralString = testStrings.templateLiteral;

                    it('should have file support', done => {
                        doHaystackTest(basicSuiteName, templateLiteralString, false, done);
                    });

                    xit('should have input support', done => {
                        doHaystackTest(testSuites.it.templateLiteral, templateLiteralString, true, done);
                    });
                });

                describe('UnaryExpression', () => {
                    const unaryExpressionString = testStrings.unaryExpression;

                    it('should have file support', done => {
                        doHaystackTest(basicSuiteName, unaryExpressionString, false, done);
                    });

                    xit('should have input support', done => {
                        doHaystackTest(testSuites.it.unaryExpression, unaryExpressionString, true, done);
                    });
                });
            });
        });
    });
});

