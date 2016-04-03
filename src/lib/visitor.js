/* eslint-disable no-func-assign */
'use strict';

(() => {
    const functionExpressionTypes = new Set(['ArrowFunctionExpression', 'FunctionExpression']),
        reDescribe = /^[f|x]?describe/,
        reFDescribe = /^fdescribe/,
        reXDescribe = /^xdescribe/,
        reIt = /^[f|x]?it/,
        reFIt = /^fit/,
        reXIt = /^xit/;

    function isFunctionExpressionType(type) {
        return functionExpressionTypes.has(type);
    }

    function parseArguments(args) {
        // We're always parsing arguments from a MemberExpression here so it's necessary
        // to enclose them in parens.
        const parsed = args.map((arg) => this.getNodeValue(this, arg)).join(', '),
            arr = [parsed];

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
        // TODO: Fold test methods into one.
        testDescribeBlock: function (name) {
            const re = this.active ? reFDescribe :
                this.inactive ? reXDescribe :
                reDescribe;

            this.testDescribeBlock = (name) => re.test(name);

            return this.testDescribeBlock(name);
        },

        testItBlock: function (name) {
            const re = this.active ? reFIt :
                this.inactive ? reXIt :
                reIt;

            this.testItBlock = name => re.test(name);

            return this.testItBlock(name);
        },

        checkCallExpression: function (node, results) {
            if (node.type === 'CallExpression') {
                const args = node.arguments,
                    name = node.callee.name;

                // Note that we always want the root 'describe' to pass regardless of the
                // value of `active` or `inactive`.
                if ((name === 'describe' && results.root) || this.testDescribeBlock(name)) {
                    const block = {
                        identifier: name,
                        map: new Map()
                    };

                    results.set(this.getNodeValue(args[0]), block);
                    return this.visit(args[1].body, block.map);
                } else if (this.verbose && this.testItBlock(name)) {
                    results.set(this.getNodeValue(args[0]), name);
                }
            }

            return results;
        },

        collect: function (node, results) {
            const type = node.type;

            if (type === 'ExpressionStatement') {
                return this.checkCallExpression(node.expression, results);
            } else if (type === 'ReturnStatement') {
                // CoffeeScript transpiles into truly heinous JavaScript. For example,
                // `describe` and `it` blocks were part of return statements, i.e.,
                //      return describe('...', () => {
                //          return it('...', () => {
                //          };
                //      };
                //
                // Because of this, it was necessary to add this if clause.
                return this.checkCallExpression(node.argument, results);
            }

            return results;
        },

        getBinaryExpression: function (node) {
            let value = [];

            value.push(
                this.getNodeValue(node.left),
                node.operator,
                this.getNodeValue(node.right)
            );

            return value = value.join(' ');
        },

        getCallExpression: function (node) {
            return this.getNodeValue(node.callee) + parseArguments.call(this, node.arguments);
        },

        getConditionalExpression: function (node) {
            return [
                this.getNodeValue(node.test),
                '?',
                this.getNodeValue(node.consequent),
                ':',
                this.getNodeValue(node.alternate)
            ].join(' ');
        },

        getIdentifier: node => node.name,

        getLiteral: node => node.raw,

        getMemberExpression: function (node) {
            const nestedObj = node.object;

            while (nestedObj) {
                return this.getNodeValue(nestedObj) + this.getProperty(node);
            }
        },

        getNodeValue: function (node) {
            let value;

            switch (node.type) {
                case 'BinaryExpression':
                    value = this.getBinaryExpression(node);
                    break;

                case 'CallExpression':
                    value = this.getCallExpression(node);
                    break;

                case 'ConditionalExpression':
                    value = this.getConditionalExpression(node);
                    break;

                case 'Identifier':
                    value = this.getIdentifier(node);
                    break;

                case 'Literal':
                    value = this.getLiteral(node);
                    break;

                case 'MemberExpression':
                    value = this.getMemberExpression(node);
                    break;

                case 'TemplateElement':
                    value = this.getTemplateElement(node);
                    break;

                case 'TemplateLiteral':
                    value = this.getTemplateLiteral(node);
                    break;

                case 'UnaryExpression':
                    value = this.getUnaryExpression(node);
                    break;
            }

            return value;
        },

        getProperty: function (node) {
            const computed = node.computed;

            return `${(computed ? '[' : '.')}${this.getNodeValue(node.property)}${(computed ? ']' : '')}`;
        },

        getTemplateElement: function (node) {
            return node.value.raw;
        },

        getTemplateLiteral: function (node) {
            const a = [];

            for (let i = 0, len = node.quasis.length; i < len; i++) {
                const n = node.quasis[i];

                if (!n.value.raw) {
                    a.push(
                        '${',
                        this.getNodeValue(node.expressions[0]),
                        '}'
                    );
                } else {
                    a.push(this.getNodeValue(n));
                }
            }

            return `\`${a.join('')}\``;
        },

        getUnaryExpression: (() => {
            const needsPadding = new Set(['delete', 'instanceof', 'typeof']);

            return function (node) {
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
            };
        })(),

        visit: function (object, results) {
            results = this.collect(object, results);

            for (const key of Object.keys(object)) {
                const obj = object[key];

                if (typeof obj === 'object' && obj !== null) {
                    this.visit(obj, results);
                }
            }

            return results;
        }
    };
})();

