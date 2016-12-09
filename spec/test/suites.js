'use strict';

const strings = require('./strings');

const arrowFunctionExpression = strings.arrowFunctionExpression;
const assignmentExpression = strings.assignmentExpression;
const binaryExpression = strings.binaryExpression;
const callExpression = strings.callExpression;
const conditionalExpression = strings.conditionalExpression;
const functionExpression = strings.functionExpression;
const memberExpression = strings.memberExpression;
const templateLiteral = strings.templateLiteral;
const unaryExpression = strings.unaryExpression;

const describe = expression =>
    `describe(${expression}, () => {});`;

const describeIt = expression =>
    `describe('test', () => {
        it(${expression}, () => {});
    });`;

module.exports = {
    describe: {
        arrowFunctionExpression: describe(arrowFunctionExpression),
        assignmentExpression: describe(assignmentExpression),
        binaryExpression: describe(binaryExpression),
        callExpression: describe(callExpression),
        conditionalExpression: describe(conditionalExpression),
        functionExpression: describe(functionExpression),
        memberExpression: describe(memberExpression),
        templateLiteral: describe(templateLiteral),
        unaryExpression: describe(unaryExpression)
    },

    it: {
        arrowFunctionExpression: describeIt(arrowFunctionExpression),
        assignmentExpression: describeIt(assignmentExpression),
        binaryExpression: describeIt(binaryExpression),
        callExpression: describeIt(callExpression),
        conditionalExpression: describeIt(conditionalExpression),
        functionExpression: describeIt(functionExpression),
        memberExpression: describeIt(memberExpression),
        templateLiteral: describeIt(templateLiteral),
        unaryExpression: describeIt(unaryExpression)
    }
};

