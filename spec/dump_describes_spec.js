/* eslint-disable no-console */
'use strict';

// TODO: Template string support.

describe('dump_describes', () => {
    let dumpDescribes = require('../src/index'),
        printer = require('../src/lib/printer/log'),
        visitor = require('../src/lib/visitor'),
        basicSuite = 'spec/test/basic_suite.js',
        transpiledSuite = 'spec/test/transpiled_suite.js',
        binaryExpressionString = "'foo' + bar",
        conditionalExpressionString = "2 + 2 === 4 ? 'world' : 'Big Brother'",
        memberExpressionString = "'baz' + foo.bar + foo['quux']",
        unaryExpressionString = "typeof ''",
        mock;

    // "Turn off" logging in the app.
    console.log = () => {};

    function doHaystackTest(suite, needle, verbose, isData, done) {
        dumpDescribes(suite, printer, verbose, isData).then((data) => {
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
            expect(dumpDescribes('fakeFile', printer) instanceof Promise).toBe(true);
        });

        it('should throw if not given a file', () => {
            expect(() => {
                dumpDescribes();
            }).toThrow();
        });

        it('should throw if not given a printer', () => {
            expect(() => {
                dumpDescribes(basicSuite);
            }).toThrow();
        });

        describe('when given input', () => {
            describe('bad input', () => {
                it('should throw if given a non-existent file', (done) => {
                    setupMockSpy(done);
                    dumpDescribes('fakeFile', printer).catch(mock.f);
                });

                it('should throw if given bad input', (done) => {
                    setupMockSpy(done);
                    dumpDescribes('this is not a test suite', printer, false, true).catch(mock.f);
                });
            });

            describe('good input', () => {
                it('should succeed when given an existing file', (done) => {
                    setupMockSpy(done);
                    dumpDescribes(basicSuite, printer).then(mock.f);
                });

                it('should succeed when given good input', (done) => {
                    setupMockSpy(done);
                    dumpDescribes('describe("foo", () => {});', printer, false, true).then(mock.f);
                });
            });
        });

        describe('no-ops', () => {
            let needle = 'No results found',
                verbose = false;

            it('should not return any results when given invalid code', (done) => {
                doHaystackTest('spec/test/bad_suite.js', needle, verbose, false, done);
            });

            it('should not return any results when given code with errors', (done) => {
                doHaystackTest('spec/test/evil_suite.js', needle, verbose, false, done);
            });

            it('should not return any results when given invalid input', (done) => {
                doHaystackTest('derp', needle, verbose, true, done);
            });

            it('should not return any results when given input with errors', (done) => {
                doHaystackTest('null.x', needle, verbose, true, done);
            });
        });

        describe('verbose', () => {
            it('should be off by default', (done) => {
                setupVisitorSpy(false, done);
                dumpDescribes(basicSuite, printer);
            });

            it('should be `false` when set', (done) => {
                setupVisitorSpy(false, done);
                dumpDescribes(basicSuite, printer, false);
            });

            it('should be `true` when set', (done) => {
                setupVisitorSpy(true, done);
                dumpDescribes(basicSuite, printer, true);
            });
        });

        // Note that these tests were added after seeing some suites transpiled into JavaScript.
        describe('when part of return statements', () => {
            let suite = "(() => { return describe('transpiled', () => { describe('when foo', () => { it('should derp', () => { expect(2 + 2).toBe(4); }); }); return describe('when bar', () => { it('should herp', () => { expect([1, 2, 4].length).toBe(3); }); return it('should double derp', () => { expect({}).not.toBe({}); }); }); }); });";

            describe('describe blocks', () => {
                let needle = 'when foo',
                    verbose = false;

                it('should work when returned from a block (file)', (done) => {
                    doHaystackTest(transpiledSuite, needle, verbose, false, done);
                });

                it('should work when returned from a block (input)', (done) => {
                    doHaystackTest(suite, 'when foo', verbose, true, done);
                });
            });

            describe('it blocks', () => {
                let needle = 'should double derp',
                    verbose = true;

                it('should work when returned from a block (file)', (done) => {
                    doHaystackTest(transpiledSuite, needle, verbose, false, done);
                });

                it('should work when returned from a block (input)', (done) => {
                    doHaystackTest(suite, needle, verbose, true, done);
                });
            });
        });

        describe('suite and spec titles', () => {
            describe('describe blocks', () => {
                let binaryExpressionSuite = "describe('foo' + bar, () => {});",
                    conditionalExpressionSuite = "describe('hello ' + (2 + 2 === 4 ? 'world' : 'Big Brother'), () => {});",
                    memberExpressionSuite = "describe('baz' + foo.bar + foo['quux'], () => {});",
                    unaryExpressionSuite = "describe(typeof '', () => {});",

                    verbose = false;

                describe('BinaryExpression', () => {
                    it('should have file support', (done) => {
                        doHaystackTest(basicSuite, binaryExpressionString, verbose, false, done);
                    });

                    it('should have input support', (done) => {
                        doHaystackTest(binaryExpressionSuite, binaryExpressionString, verbose, true, done);
                    });
                });

                describe('ConditionalExpression', () => {
                    it('should have file support', (done) => {
                        doHaystackTest(basicSuite, conditionalExpressionString, verbose, false, done);
                    });

                    it('should have input support', (done) => {
                        doHaystackTest(conditionalExpressionSuite, conditionalExpressionString, verbose, true, done);
                    });
                });

                describe('MemberExpression', () => {
                    it('should have file support', (done) => {
                        doHaystackTest(basicSuite, memberExpressionString, verbose, false, done);
                    });

                    it('should have input support', (done) => {
                        doHaystackTest(memberExpressionSuite, memberExpressionString, verbose, true, done);
                    });
                });

                describe('UnaryExpression', () => {
                    it('should have file support', (done) => {
                        doHaystackTest(basicSuite, unaryExpressionString, verbose, false, done);
                    });

                    it('should have file support', (done) => {
                        doHaystackTest(unaryExpressionSuite, unaryExpressionString, verbose, true, done);
                    });
                });
            });

            describe('it blocks', () => {
                let binaryExpressionSuite = "describe('test', () => { it('foo' + bar, () => {});});",
                    conditionalExpressionSuite = "describe('test', () => { it('hello ' + (2 + 2 === 4 ? 'world' : 'Big Brother'), () => {});});",
                    memberExpressionSuite = "describe('test', () => { it('baz' + foo.bar + foo['quux'], () => {});});",
                    unaryExpressionSuite = "describe('test', () => { it(typeof '', () => {});});",
                    verbose = true;

                describe('BinaryExpression', () => {
                    it('should have file support', (done) => {
                        doHaystackTest(basicSuite, binaryExpressionString, verbose, false, done);
                    });

                    it('should have input support', (done) => {
                        doHaystackTest(binaryExpressionSuite, binaryExpressionString, verbose, true, done);
                    });
                });

                describe('ConditionalExpression', () => {
                    it('should have file support', (done) => {
                        doHaystackTest(basicSuite, conditionalExpressionString, verbose, false, done);
                    });

                    it('should have input support', (done) => {
                        doHaystackTest(conditionalExpressionSuite, conditionalExpressionString, verbose, true, done);
                    });
                });

                describe('MemberExpression', () => {
                    it('should have file support', (done) => {
                        doHaystackTest(basicSuite, memberExpressionString, verbose, false, done);
                    });

                    it('should have input support', (done) => {
                        doHaystackTest(memberExpressionSuite, memberExpressionString, verbose, true, done);
                    });
                });

                describe('UnaryExpression', () => {
                    it('should have file support', (done) => {
                        doHaystackTest(basicSuite, unaryExpressionString, verbose, false, done);
                    });

                    it('should have input support', (done) => {
                        doHaystackTest(unaryExpressionSuite, unaryExpressionString, verbose, true, done);
                    });
                });
            });
        });
    });
});

