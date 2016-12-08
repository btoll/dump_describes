/* eslint-disable quotes */

module.exports = {
    binaryExpression: "'foo' + bar",
    callExpression: "quux() + 'baz ' + foo('derp').bar()",
    conditionalExpression: `'hello ' + (2 + 2 === 4 ? 'world' : 'Big Brother')`,
    memberExpression: "'baz' + foo.bar + foo['quux']",
    templateLiteral: '`baz ${foo.bar}`',
    unaryExpression: "typeof ''"
};

