'use strict';

(() => {
    let getNodeValue = function (node) {
        let value;

        switch (node.type) {
            case 'BinaryExpression':
                value = this.getBinaryExpression(node);
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
    reDescribe = /[f|x]?describe/,
    reIt = /[f|x]?it/;

    module.exports = Object.setPrototypeOf({
        checkCallExpression: function (node, results) {
            if (node.type === 'CallExpression') {
                let args = node.arguments,
                    name = node.callee.name;

                if (reDescribe.test(name)) {
                    let block = {
                        identifier: name,
                        map: new Map()
                    };

                    results.set(getNodeValue.call(this, args[0]), block);
                    return this.visit(args[1].body, block.map);
                } else if (this.verbose && reIt.test(name)) {
                    results.set(getNodeValue.call(this, args[0]), name);
                }
            }

            return results;
        },

        collect: function (node, results) {
            let type = node.type;

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
                getNodeValue.call(this, node.left),
                node.operator,
                getNodeValue.call(this, node.right)
            );

            return value = value.join(' ');
        },

        getConditionalExpression: function (node) {
            return [
                getNodeValue.call(this, node.test),
                '?',
                getNodeValue.call(this, node.consequent),
                ':',
                getNodeValue.call(this, node.alternate)
            ].join(' ');
        },

        getIdentifier: (node) => {
            return node.name;
        },

        getLiteral: (node) => {
            return node.raw;
        },

        getMemberExpression: function (node) {
            let nestedObj = node.object;

            while (nestedObj) {
                return getNodeValue.call(this, nestedObj) + this.getProperty(node);
            }
        },

        getProperty: function (node) {
            let computed = node.computed;

            return `${(computed ? '[' : '.')}${getNodeValue.call(this, node.property)}${(computed ? ']' : '')}`;
        },

        getTemplateElement: function (node) {
            return node.value.raw;
        },

        getTemplateLiteral: function (node) {
            let a = [];

            for (let i = 0, len = node.quasis.length; i < len; i++) {
                let n = node.quasis[i];

                if (!n.value.raw) {
                    a.push(
                        '${',
                        getNodeValue.call(this, node.expressions[0]),
                        '}'
                    );
                } else {
                    a.push(getNodeValue.call(this, n));
                }
            }

            return `\`${a.join('')}\``;
        },

        getUnaryExpression: (() => {
            let needsPadding = new Set(['delete', 'instanceof', 'typeof']);

            return function (node) {
                let arg = node.argument,
                    // Pad the operator in cases where it's `delete`, `typeof`, etc.
                    operator = node.operator;

                if (needsPadding.has(operator)) {
                    operator = ' ' + operator + ' ';
                }

                while (arg) {
                    return (node.prefix) ?
                        operator + getNodeValue.call(this, arg) :
                        getNodeValue.call(this, arg) + operator;
                }
            };
        })(),

        visit: function (object, results) {
            results = this.collect(object, results);

            for (let n in object) {
                if (object.hasOwnProperty(n)) {
                    let obj = object[n];

                    if (typeof obj === 'object' && obj !== null) {
                        this.visit(obj, results);
                    }
                }
            }

            return results;
        }
    }, null);
})();

