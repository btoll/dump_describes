(() => {
    'use strict';

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

            case 'UnaryExpression':
                value = this.getUnaryExpression(node);
                break;
        }

        return value;
    };

    module.exports = Object.setPrototypeOf({
        collect: function (node, results, verbose) {
            let type = node.type;

            if (type === 'ExpressionStatement') {
                let expression = node.expression;

                if (expression.type === 'CallExpression') {
                    let args = expression.arguments,
                        name = expression.callee.name;

                    if (name === 'describe') {
                        let map = new Map();

                        results.set(getNodeValue.call(this, args[0]), map);
                        return this.visit(args[1].body, this.collect, map, verbose);
                    } else if (verbose && name === 'it') {
                        results.set(getNodeValue.call(this, args[0]), true);
                    }
                }
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
            let value = '.' + node.property.name,
                nestedObj = node.object;

            while (nestedObj) {
                return getNodeValue.call(this, nestedObj) + value;
            }

            // TODO: return value?
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

                return node.name;
            };
        })(),

        visit: function (object, fn, results, verbose) {
            results = fn.call(this, object, results, verbose);

            for (let n in object) {
                if (object.hasOwnProperty(n)) {
                    let obj = object[n];

                    if (typeof obj === 'object' && obj !== null) {
                        this.visit(obj, fn, results, verbose);
                    }
                }
            }

            return results;
        }
    }, null);
})();

