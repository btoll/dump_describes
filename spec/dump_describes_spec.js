'use strict';

const dumpDescribes = require('../src/index');
const generator = require('../src/generator/log');
const visitor = require('../src/visitor');

const testStrings = require('./test/strings');
const testSuites = require('./test/suites');

describe('dump_describes', () => {
    const basicSuiteName = 'spec/test/basic_suite.js';
    const transpiledSuiteName = 'spec/test/transpiled_suite.js';

    let mock;

    function doHaystackTest(suite, needle, options, isData, done) {
        dumpDescribes(suite, generator, options, isData).then(data => {
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

    function setupVisitorSpy(bool, done) {
        spyOn(visitor, 'visit').and.callFake(() => {
            expect(visitor.verbose).toBe(bool);
            done();
        });
    }

    describe('making a suite', () => {
        it('should return a promise', () => {
            expect(dumpDescribes('fakeFile', generator) instanceof Promise).toBe(true);
        });

        it('should throw if not given a file', () => {
            expect(() => {
                dumpDescribes();
            }).toThrow();
        });

        it('should throw if not given a generator', () => {
            expect(() => {
                dumpDescribes(basicSuiteName);
            }).toThrow();
        });

        describe('when given input', () => {
            describe('bad input', () => {
                it('should throw if given a non-existent file', done => {
                    setupMockSpy(done);
                    dumpDescribes('fakeFile', generator).catch(mock.f);
                });

                it('should throw if given bad input', done => {
                    setupMockSpy(done);
                    dumpDescribes('this is not a test suite', generator, {verbose: false}, true).catch(mock.f);
                });
            });

            describe('good input', () => {
                it('should succeed when given an existing file', done => {
                    setupMockSpy(done);
                    dumpDescribes(basicSuiteName, generator).then(mock.f);
                });

                it('should succeed when given good input', done => {
                    setupMockSpy(done);
                    dumpDescribes('describe("foo", () => {});', generator, {verbose: false}, true).then(mock.f);
                });
            });
        });

        describe('no-ops', () => {
            const needle = 'No results found';
            const options = {
                verbose: false
            };

            it('should not return any results when given invalid code', done => {
                doHaystackTest('spec/test/bad_suite.js', needle, options, false, done);
            });

            it('should not return any results when given code with errors', done => {
                doHaystackTest('spec/test/evil_suite.js', needle, options, false, done);
            });

            it('should not return any results when given invalid input', done => {
                doHaystackTest('derp', needle, options, true, done);
            });

            it('should not return any results when given input with errors', done => {
                doHaystackTest('null.x', needle, options, true, done);
            });
        });

        describe('verbose', () => {
            it('should be off by default', done => {
                setupVisitorSpy(false, done);
                dumpDescribes(basicSuiteName, generator);
            });

            it('should be `false` when set', done => {
                setupVisitorSpy(false, done);
                dumpDescribes(basicSuiteName, generator, {verbose: false});
            });

            it('should be `true` when set', done => {
                setupVisitorSpy(true, done);
                dumpDescribes(basicSuiteName, generator, {verbose: true});
            });
        });

        // Note that these tests were added after seeing some suites transpiled into JavaScript.
        describe('when part of return statements', () => {
            const suite = "(() => { return describe('transpiled', () => { describe('when foo', () => { it('should derp', () => { expect(2 + 2).toBe(4); }); }); return describe('when bar', () => { it('should herp', () => { expect([1, 2, 4].length).toBe(3); }); return it('should double derp', () => { expect({}).not.toBe({}); }); }); }); });";

            describe('describe blocks', () => {
                const needle = 'when foo';
                const options = {
                    verbose: false
                };

                it('should work when returned from a block (file)', done => {
                    doHaystackTest(transpiledSuiteName, needle, options, false, done);
                });

                it('should work when returned from a block (input)', done => {
                    doHaystackTest(suite, 'when foo', options, true, done);
                });
            });

            describe('it blocks', () => {
                const needle = 'should double derp';
                const options = {
                    verbose: true
                };

                it('should work when returned from a block (file)', done => {
                    doHaystackTest(transpiledSuiteName, needle, options, false, done);
                });

                it('should work when returned from a block (input)', done => {
                    doHaystackTest(suite, needle, options, true, done);
                });
            });
        });

        describe('suite and spec titles', () => {
            describe('describe blocks', () => {
                const options = {
                    verbose: false
                };

                describe('ArrowFunctionExpression', () => {
                    const arrowFunctionExpressionString = testStrings.arrowFunctionExpression;

                    it('should have file support', done => {
                        doHaystackTest(basicSuiteName, arrowFunctionExpressionString, options, false, done);
                    });

                    it('should have input support', done => {
                        doHaystackTest(testSuites.describe.arrowFunctionExpression, arrowFunctionExpressionString, options, true, done);
                    });
                });

                describe('AssignmentExpression', () => {
                    const assignmentExpressionString = testStrings.assignmentExpression;

                    it('should have file support', done => {
                        doHaystackTest(basicSuiteName, assignmentExpressionString, options, false, done);
                    });

                    it('should have input support', done => {
                        doHaystackTest(testSuites.describe.assignmentExpression, assignmentExpressionString, options, true, done);
                    });
                });

                describe('BinaryExpression', () => {
                    const binaryExpressionString = testStrings.binaryExpression;

                    it('should have file support', done => {
                        doHaystackTest(basicSuiteName, binaryExpressionString, options, false, done);
                    });

                    it('should have input support', done => {
                        doHaystackTest(testSuites.describe.binaryExpression, binaryExpressionString, options, true, done);
                    });
                });

                describe('CallExpression', () => {
                    const callExpressionString = testStrings.callExpression;

                    it('should have file support', done => {
                        doHaystackTest(basicSuiteName, callExpressionString, options, false, done);
                    });

                    it('should have input support', done => {
                        doHaystackTest(testSuites.describe.callExpression, callExpressionString, options, true, done);
                    });
                });

                describe('ConditionalExpression', () => {
                    const conditionalExpressionString = testStrings.conditionalExpression;

                    it('should have file support', done => {
                        doHaystackTest(basicSuiteName, conditionalExpressionString, options, false, done);
                    });

                    it('should have input support', done => {
                        doHaystackTest(testSuites.describe.conditionalExpression, conditionalExpressionString, options, true, done);
                    });
                });

                describe('FunctionExpression', () => {
                    const functionExpressionString = testStrings.functionExpression;

                    it('should have file support', done => {
                        doHaystackTest(basicSuiteName, functionExpressionString, options, false, done);
                    });

                    it('should have input support', done => {
                        doHaystackTest(testSuites.describe.functionExpression, functionExpressionString, options, true, done);
                    });
                });

                describe('MemberExpression', () => {
                    const memberExpressionString = testStrings.memberExpression;

                    it('should have file support', done => {
                        doHaystackTest(basicSuiteName, memberExpressionString, options, false, done);
                    });

                    it('should have input support', done => {
                        doHaystackTest(testSuites.describe.memberExpression, memberExpressionString, options, true, done);
                    });
                });

                describe('TemplateLiteral', () => {
                    const templateLiteralString = testStrings.templateLiteral;

                    it('should have file support', done => {
                        doHaystackTest(basicSuiteName, templateLiteralString, options, false, done);
                    });

                    it('should have input support', done => {
                        doHaystackTest(testSuites.describe.templateLiteral, templateLiteralString, options, true, done);
                    });
                });

                describe('UnaryExpression', () => {
                    const unaryExpressionString = testStrings.unaryExpression;

                    it('should have file support', done => {
                        doHaystackTest(basicSuiteName, unaryExpressionString, options, false, done);
                    });

                    it('should have file support', done => {
                        doHaystackTest(testSuites.describe.unaryExpression, unaryExpressionString, options, true, done);
                    });
                });
            });

            describe('it blocks', () => {
                const options = {
                    verbose: true
                };

                describe('ArrowFunctionExpression', () => {
                    const arrowFunctionExpressionString = testStrings.arrowFunctionExpression;

                    it('should have file support', done => {
                        doHaystackTest(basicSuiteName, arrowFunctionExpressionString, options, false, done);
                    });

                    it('should have input support', done => {
                        doHaystackTest(testSuites.it.arrowFunctionExpression, arrowFunctionExpressionString, options, true, done);
                    });
                });

                describe('AssignmentExpression', () => {
                    const assignmentExpressionString = testStrings.assignmentExpression;

                    it('should have file support', done => {
                        doHaystackTest(basicSuiteName, assignmentExpressionString, options, false, done);
                    });

                    it('should have input support', done => {
                        doHaystackTest(testSuites.it.assignmentExpression, assignmentExpressionString, options, true, done);
                    });
                });

                describe('BinaryExpression', () => {
                    const binaryExpressionString = testStrings.binaryExpression;

                    it('should have file support', done => {
                        doHaystackTest(basicSuiteName, binaryExpressionString, options, false, done);
                    });

                    it('should have input support', done => {
                        doHaystackTest(testSuites.it.binaryExpression, binaryExpressionString, options, true, done);
                    });
                });

                describe('CallExpression', () => {
                    const callExpressionString = testStrings.callExpression;

                    it('should have file support', done => {
                        doHaystackTest(basicSuiteName, callExpressionString, options, false, done);
                    });

                    it('should have input support', done => {
                        doHaystackTest(testSuites.it.callExpression, callExpressionString, options, true, done);
                    });
                });

                describe('ConditionalExpression', () => {
                    const conditionalExpressionString = testStrings.conditionalExpression;

                    it('should have file support', done => {
                        doHaystackTest(basicSuiteName, conditionalExpressionString, options, false, done);
                    });

                    it('should have input support', done => {
                        doHaystackTest(testSuites.it.conditionalExpression, conditionalExpressionString, options, true, done);
                    });
                });

                describe('FunctionExpression', () => {
                    const functionExpressionString = testStrings.functionExpression;

                    it('should have file support', done => {
                        doHaystackTest(basicSuiteName, functionExpressionString, options, false, done);
                    });

                    it('should have input support', done => {
                        doHaystackTest(testSuites.it.functionExpression, functionExpressionString, options, true, done);
                    });
                });

                describe('MemberExpression', () => {
                    const memberExpressionString = testStrings.memberExpression;

                    it('should have file support', done => {
                        doHaystackTest(basicSuiteName, memberExpressionString, options, false, done);
                    });

                    it('should have input support', done => {
                        doHaystackTest(testSuites.it.memberExpression, memberExpressionString, options, true, done);
                    });
                });

                describe('TemplateLiteral', () => {
                    const templateLiteralString = testStrings.templateLiteral;

                    it('should have file support', done => {
                        doHaystackTest(basicSuiteName, templateLiteralString, options, false, done);
                    });

                    it('should have input support', done => {
                        doHaystackTest(testSuites.it.templateLiteral, templateLiteralString, options, true, done);
                    });
                });

                describe('UnaryExpression', () => {
                    const unaryExpressionString = testStrings.unaryExpression;

                    it('should have file support', done => {
                        doHaystackTest(basicSuiteName, unaryExpressionString, options, false, done);
                    });

                    it('should have input support', done => {
                        doHaystackTest(testSuites.it.unaryExpression, unaryExpressionString, options, true, done);
                    });
                });
            });
        });
    });
});

