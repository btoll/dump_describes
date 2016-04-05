'use strict';

describe('dump_describes', () => {
    const dumpDescribes = require('../src/index'),
        generator = require('../src/lib/generator/log'),
        visitor = require('../src/lib/visitor'),
        basicSuite = 'spec/test/basic_suite.js',
        transpiledSuite = 'spec/test/transpiled_suite.js',
        binaryExpressionString = "'foo' + bar",
        callExpressionString = "quux() + 'baz ' + foo('derp').bar()",
        conditionalExpressionString = "2 + 2 === 4 ? 'world' : 'Big Brother'",
        memberExpressionString = "'baz' + foo.bar + foo['quux']",
        templateLiteralString = '`baz ${foo.bar}`',
        unaryExpressionString = "typeof ''";

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
                dumpDescribes(basicSuite);
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
                    dumpDescribes(basicSuite, generator).then(mock.f);
                });

                it('should succeed when given good input', done => {
                    setupMockSpy(done);
                    dumpDescribes('describe("foo", () => {});', generator, {verbose: false}, true).then(mock.f);
                });
            });
        });

        describe('no-ops', () => {
            const needle = 'No results found',
                options = {
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
                dumpDescribes(basicSuite, generator);
            });

            it('should be `false` when set', done => {
                setupVisitorSpy(false, done);
                dumpDescribes(basicSuite, generator, {verbose: false});
            });

            it('should be `true` when set', done => {
                setupVisitorSpy(true, done);
                dumpDescribes(basicSuite, generator, {verbose: true});
            });
        });

        // Note that these tests were added after seeing some suites transpiled into JavaScript.
        describe('when part of return statements', () => {
            const suite = "(() => { return describe('transpiled', () => { describe('when foo', () => { it('should derp', () => { expect(2 + 2).toBe(4); }); }); return describe('when bar', () => { it('should herp', () => { expect([1, 2, 4].length).toBe(3); }); return it('should double derp', () => { expect({}).not.toBe({}); }); }); }); });";

            describe('describe blocks', () => {
                const needle = 'when foo',
                    options = {
                        verbose: false
                    };

                it('should work when returned from a block (file)', done => {
                    doHaystackTest(transpiledSuite, needle, options, false, done);
                });

                it('should work when returned from a block (input)', done => {
                    doHaystackTest(suite, 'when foo', options, true, done);
                });
            });

            describe('it blocks', () => {
                const needle = 'should double derp',
                    options = {
                        verbose: true
                    };

                it('should work when returned from a block (file)', done => {
                    doHaystackTest(transpiledSuite, needle, options, false, done);
                });

                it('should work when returned from a block (input)', done => {
                    doHaystackTest(suite, needle, options, true, done);
                });
            });
        });

        describe('suite and spec titles', () => {
            describe('describe blocks', () => {
                const binaryExpressionSuite = "describe('foo' + bar, () => {});",
                    callExpressionSuite = "describe(quux() + 'baz ' + foo('derp').bar(), () => {});",
                    conditionalExpressionSuite = "describe('hello ' + (2 + 2 === 4 ? 'world' : 'Big Brother'), () => {});",
                    memberExpressionSuite = "describe('baz' + foo.bar + foo['quux'], () => {});",
                    templateLiteralSuite = 'describe(`baz ${foo.bar}`, () => {});',
                    unaryExpressionSuite = "describe(typeof '', () => {});",
                    options = {
                        verbose: false
                    };

                describe('BinaryExpression', () => {
                    it('should have file support', done => {
                        doHaystackTest(basicSuite, binaryExpressionString, options, false, done);
                    });

                    it('should have input support', done => {
                        doHaystackTest(binaryExpressionSuite, binaryExpressionString, options, true, done);
                    });
                });

                xdescribe('CallExpression', () => {
                    it('should have file support', done => {
                        doHaystackTest(basicSuite, callExpressionString, options, false, done);
                    });

                    it('should have input support', done => {
                        doHaystackTest(callExpressionSuite, callExpressionString, options, true, done);
                    });
                });

                describe('ConditionalExpression', () => {
                    it('should have file support', done => {
                        doHaystackTest(basicSuite, conditionalExpressionString, options, false, done);
                    });

                    it('should have input support', done => {
                        doHaystackTest(conditionalExpressionSuite, conditionalExpressionString, options, true, done);
                    });
                });

                describe('MemberExpression', () => {
                    it('should have file support', done => {
                        doHaystackTest(basicSuite, memberExpressionString, options, false, done);
                    });

                    it('should have input support', done => {
                        doHaystackTest(memberExpressionSuite, memberExpressionString, options, true, done);
                    });
                });

                describe('TemplateLiteral', () => {
                    it('should have file support', done => {
                        doHaystackTest(basicSuite, templateLiteralString, options, false, done);
                    });

                    it('should have input support', done => {
                        doHaystackTest(templateLiteralSuite, templateLiteralString, options, true, done);
                    });
                });

                describe('UnaryExpression', () => {
                    it('should have file support', done => {
                        doHaystackTest(basicSuite, unaryExpressionString, options, false, done);
                    });

                    it('should have file support', done => {
                        doHaystackTest(unaryExpressionSuite, unaryExpressionString, options, true, done);
                    });
                });
            });

            describe('it blocks', () => {
                const binaryExpressionSuite = "describe('test', () => { it('foo' + bar, () => {});});",
                    callExpressionSuite = "describe('test', () => { it(quux() + 'baz ' + foo('derp').bar(), () => {});});",
                    conditionalExpressionSuite = "describe('test', () => { it('hello ' + (2 + 2 === 4 ? 'world' : 'Big Brother'), () => {});});",
                    memberExpressionSuite = "describe('test', () => { it('baz' + foo.bar + foo['quux'], () => {});});",
                    templateLiteralSuite = "describe('test', () => { it(`baz ${foo.bar}`, () => {});});",
                    unaryExpressionSuite = "describe('test', () => { it(typeof '', () => {});});",
                    options = {
                        verbose: true
                    };

                describe('BinaryExpression', () => {
                    it('should have file support', done => {
                        doHaystackTest(basicSuite, binaryExpressionString, options, false, done);
                    });

                    it('should have input support', done => {
                        doHaystackTest(binaryExpressionSuite, binaryExpressionString, options, true, done);
                    });
                });

                xdescribe('CallExpression', () => {
                    it('should have file support', done => {
                        doHaystackTest(basicSuite, callExpressionString, options, false, done);
                    });

                    it('should have input support', done => {
                        doHaystackTest(callExpressionSuite, callExpressionString, options, true, done);
                    });
                });

                describe('ConditionalExpression', () => {
                    it('should have file support', done => {
                        doHaystackTest(basicSuite, conditionalExpressionString, options, false, done);
                    });

                    it('should have input support', done => {
                        doHaystackTest(conditionalExpressionSuite, conditionalExpressionString, options, true, done);
                    });
                });

                describe('MemberExpression', () => {
                    it('should have file support', done => {
                        doHaystackTest(basicSuite, memberExpressionString, options, false, done);
                    });

                    it('should have input support', done => {
                        doHaystackTest(memberExpressionSuite, memberExpressionString, options, true, done);
                    });
                });

                describe('TemplateLiteral', () => {
                    it('should have file support', done => {
                        doHaystackTest(basicSuite, templateLiteralString, options, false, done);
                    });

                    it('should have input support', done => {
                        doHaystackTest(templateLiteralSuite, templateLiteralString, options, true, done);
                    });
                });

                describe('UnaryExpression', () => {
                    it('should have file support', done => {
                        doHaystackTest(basicSuite, unaryExpressionString, options, false, done);
                    });

                    it('should have input support', done => {
                        doHaystackTest(unaryExpressionSuite, unaryExpressionString, options, true, done);
                    });
                });
            });
        });
    });
});

