'use strict';

const generator = require('../src/generator/log');
const onfStatic = require('onf-static');
const dumpDescribesVisitor = require('../src/visitor');

const testStrings = require('./helper/strings');
const testSuites = require('./helper/suites');

describe('dump_describes', () => {
    const dumpDescribes = onfStatic.makeTree;
    const basicSuiteName = 'test/helper/basic_suite.js';

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

    describe('node types', () => {
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

        describe('it blocks', () => {
            beforeAll(() => {
                onfStatic.setOptions({
                    useMap: true,
                    verbose: true
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

                it('should have input support', done => {
                    doHaystackTest(testSuites.it.arrowFunctionExpression, arrowFunctionExpressionString, true, done);
                });
            });

            describe('AssignmentExpression', () => {
                const assignmentExpressionString = testStrings.assignmentExpression;

                it('should have file support', done => {
                    doHaystackTest(basicSuiteName, assignmentExpressionString, false, done);
                });

                it('should have input support', done => {
                    doHaystackTest(testSuites.it.assignmentExpression, assignmentExpressionString, true, done);
                });
            });

            describe('BinaryExpression', () => {
                const binaryExpressionString = testStrings.binaryExpression;

                it('should have file support', done => {
                    doHaystackTest(basicSuiteName, binaryExpressionString, false, done);
                });

                it('should have input support', done => {
                    doHaystackTest(testSuites.it.binaryExpression, binaryExpressionString, true, done);
                });
            });

            describe('CallExpression', () => {
                const callExpressionString = testStrings.callExpression;

                it('should have file support', done => {
                    doHaystackTest(basicSuiteName, callExpressionString, false, done);
                });

                it('should have input support', done => {
                    doHaystackTest(testSuites.it.callExpression, callExpressionString, true, done);
                });
            });

            describe('ConditionalExpression', () => {
                const conditionalExpressionString = testStrings.conditionalExpression;

                it('should have file support', done => {
                    doHaystackTest(basicSuiteName, conditionalExpressionString, false, done);
                });

                it('should have input support', done => {
                    doHaystackTest(testSuites.it.conditionalExpression, conditionalExpressionString, true, done);
                });
            });

            describe('FunctionExpression', () => {
                const functionExpressionString = testStrings.functionExpression;

                it('should have file support', done => {
                    doHaystackTest(basicSuiteName, functionExpressionString, false, done);
                });

                it('should have input support', done => {
                    doHaystackTest(testSuites.it.functionExpression, functionExpressionString, true, done);
                });
            });

            describe('MemberExpression', () => {
                const memberExpressionString = testStrings.memberExpression;

                it('should have file support', done => {
                    doHaystackTest(basicSuiteName, memberExpressionString, false, done);
                });

                it('should have input support', done => {
                    doHaystackTest(testSuites.it.memberExpression, memberExpressionString, true, done);
                });
            });

            describe('TemplateLiteral', () => {
                const templateLiteralString = testStrings.templateLiteral;

                it('should have file support', done => {
                    doHaystackTest(basicSuiteName, templateLiteralString, false, done);
                });

                it('should have input support', done => {
                    doHaystackTest(testSuites.it.templateLiteral, templateLiteralString, true, done);
                });
            });

            describe('UnaryExpression', () => {
                const unaryExpressionString = testStrings.unaryExpression;

                it('should have file support', done => {
                    doHaystackTest(basicSuiteName, unaryExpressionString, false, done);
                });

                it('should have input support', done => {
                    doHaystackTest(testSuites.it.unaryExpression, unaryExpressionString, true, done);
                });
            });
        });
    });
});

