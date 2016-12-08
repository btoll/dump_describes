'use strict';

const strings = require('./strings');

const binaryExpression = strings.binaryExpression;
const callExpression = strings.callExpression;
const conditionalExpression = strings.conditionalExpression;
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
        binaryExpression: describe(binaryExpression),
        callExpression: describe(callExpression),
        conditionalExpression: describe(conditionalExpression),
        memberExpression: describe(memberExpression),
        templateLiteral: describe(templateLiteral),
        unaryExpression: describe(unaryExpression)
    },

    it: {
        binaryExpression: describeIt(binaryExpression),
        callExpression: describeIt(callExpression),
        conditionalExpression: describeIt(conditionalExpression),
        memberExpression: describeIt(memberExpression),
        templateLiteral: describeIt(templateLiteral),
        unaryExpression: describeIt(unaryExpression)
    }
};

