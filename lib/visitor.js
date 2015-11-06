(() => {
    'use strict';

    module.exports = Object.setPrototypeOf({
        collect: function (node, results) {
            let type = node.type;

            if (type === 'ExpressionStatement') {
                let expression = node.expression,
                    callee = expression.callee,
                    args = expression.arguments;

                if (expression.type === 'CallExpression' && callee.name === 'describe') {
                    let node = args[0],
                        value;

                    //
                    // Node types we're interested in:
                    //     --> BinaryExpression
                    //     --> ConditionalExpression
                    //     --> Literal
                    //     --> UnaryExpression
                    //

                    value = this['get' + node.type](node);
                    results.set(value, new Map());

                    return this.visit(args[1].body, this.collect, results.get(value));
                }
            }

            return results;
        },

        getBinaryExpression: (() => {
            let getNodeValue = (node) => {
                let value;

                switch (node.type) {
                    case 'Identifier':
                        value = node.name;
                        break;

                    case 'Literal':
                        value = node.raw;
                        break;

                    case 'UnaryExpression':
                        value = this.getUnaryExpression(node);
                        break;
                }

                return value;
            };

            return (node) => {
                let nodeLeft = node.left,
                    value = [];

                value.push(
                    getNodeValue(nodeLeft),
                    ' ' + node.operator + ' ',
                    getNodeValue(node.right)
                );

                value = value.join(' ');

                while (nodeLeft && nodeLeft.left) {
                    return this.getBinaryExpression(nodeLeft) + value;
                }

                return value;
            };
        })(),

        getConditionalExpression: (node) => {
            // TODO: Support nested ternaries.
            return [node.test.name, ' ? ', node.consequent.raw, ' : ', node.alternate.raw].join(' ');
        },

        getLiteral: (node) => {
            return node.value;
        },

        getUnaryExpression: (() => {
            let needsPadding = new Set(['delete', 'instanceof', 'typeof']);

            return (node) => {
                let arg = node.argument,
                    // Pad the operator in cases where it's `delete`, `typeof`, etc.
                    operator = node.operator;

                if (needsPadding.has(operator)) {
                    operator = ' ' + operator + ' ';
                }

                while (arg) {
                    return (node.prefix) ?
                        operator + this.getUnaryExpression(arg) :
                        this.getUnaryExpression(arg) + operator;
                }

                return node.name;
            };
        })(),

        visit: function (object, fn, results) {
            results = fn.call(this, object, results);

            for (let n in object) {
                if (object.hasOwnProperty(n)) {
                    let obj = object[n];

                    if (typeof obj === 'object' && obj !== null) {
                        this.visit(obj, fn, results);
                    }
                }
            }

            return results;
        }
    }, null);
})();

