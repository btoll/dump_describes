/* eslint-disable no-case-declarations,one-var */
'use strict';

let needsPadding = new Set(['delete', 'instanceof', 'typeof']);
const functionExpressionTypes = new Set(['ArrowFunctionExpression', 'FunctionExpression']);

const isFunctionExpressionType =type =>
    functionExpressionTypes.has(type);

function parseArguments(args) {
    // We're always parsing arguments from a CallExpression or MemberExpression here so it's necessary
    // to enclose them in parens.
    const parsed = args.map(arg => this.getNodeValue(arg)).join(', ');
    const arr = [parsed];

    if (args.length) {
        if (!isFunctionExpressionType(args[0].type)) {
            arr.unshift('(');
        }
    } else {
        arr.unshift('(');
    }

    arr.push(')');

    return arr.join('');
}

module.exports = {
    getNodeValue: function (node) {
        let value;

        switch (node.type) {
            case 'AssignmentExpression':
            case 'BinaryExpression':
                value = [
                    this.getNodeValue(node.left),
                    node.operator,
                    this.getNodeValue(node.right)
                ].join(' ');
                break;

            case 'CallExpression':
                value = this.getNodeValue(node.callee) + parseArguments.call(this, node.arguments);
                break;

            case 'ConditionalExpression':
                value = [
                    '(',
                    this.getNodeValue(node.test),
                    ' ? ',
                    this.getNodeValue(node.consequent),
                    ' : ',
                    this.getNodeValue(node.alternate),
                    ')'
                ].join('');
                break;

            case 'Identifier':
                value = node.name;
                break;

            case 'Literal':
                value = node.raw;
                break;

            case 'MemberExpression':
                let nestedObj = node.object;

                // TODO
//                    while (nestedObj) {
                    value = this.getNodeValue(nestedObj) + this.getProperty(node);
//                    }
                break;

            case 'TemplateElement':
                value = node.value.raw;
                break;

            case 'TemplateLiteral':
                let a = [];

                for (let i = 0, len = node.quasis.length; i < len; i++) {
                    let n = node.quasis[i];

                    if (!n.value.raw) {
                        a.push(
                            '${',
        //                    this.getNodeValue(node.expressions.shift()),
                            this.getNodeValue(node.expressions[0]),
                            '}'
                        );
                    } else {
                        a.push(this.getNodeValue(n));
                    }
                }

                value = `\`${a.join('')}\``;
                break;

            case 'UnaryExpression':
                const arg = node.argument;
                // Pad the operator in cases where it's `delete`, `typeof`, etc.
                let operator = node.operator;

                if (needsPadding.has(operator)) {
                    operator = ' ' + operator + ' ';
                }

                while (arg) {
                    return (node.prefix) ?
                        operator + this.getNodeValue(arg) :
                        this.getNodeValue(arg) + operator;
                }
        }

        return value;
    },
    getProperty: function (node) {
        const computed = node.computed;

        return `${(computed ? '[' : '.')}${this.getNodeValue(node.property)}${(computed ? ']' : '')}`;
    }
};

