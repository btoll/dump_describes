/* eslint-disable no-case-declarations */
'use strict';

const reDescribe = /^[f|x]?describe/;
const reFDescribe = /^fdescribe/;
const reXDescribe = /^xdescribe/;
const reIt = /^[f|x]?it/;
const reFIt = /^fit/;
const reXIt = /^xit/;

module.exports = {
    // TODO: Fold test methods into one?
    testDescribeBlock: function (name) {
        const re = this.active ? reFDescribe :
            this.inactive ? reXDescribe :
            reDescribe;

        // Memoize.
        this.testDescribeBlock = name => re.test(name);

        return this.testDescribeBlock(name);
    },

    testItBlock: function (name) {
        const re = this.active ? reFIt :
            this.inactive ? reXIt :
            reIt;

        // Memoize.
        this.testItBlock = name => re.test(name);

        return this.testItBlock(name);
    },

    visit: function (node, results) {
        switch (node.type) {
            case 'ArrowFunctionExpression':
            case 'FunctionExpression':
                const bodies = node.body.body;

                if (bodies && Array.isArray(bodies)) {
                    bodies.forEach(body => this.visit(body, results));
                }
                break;

//             case 'AssignmentExpression':
//                 return [
//                     this.visit(node.left, results),
//                     node.operator,
//                     this.visit(node.right, results)
//                 ].join(' ');

            case 'BlockStatement':
                node.body.forEach(node => this.visit(node, results));
                break;

            case 'CallExpression':
                // TODO
                const args = node.arguments;
                const name = node.callee.name;

                if (this.testDescribeBlock(name)) {
                    let block = {
                        identifier: name,
                        map: new Map()
                    };

                    results.set(args.slice(0, -1), block);
                    this.visit(args.slice(-1)[0].body, block.map);
                } else if (this.verbose && this.testItBlock(name)) {
                    results.set([args[0]], name);
                } else {
                    node.arguments.forEach(node => this.visit(node, results));
                    this.visit(node.callee, results);
                }
                break;

            case 'ExpressionStatement':
                this.visit(node.expression, results);
                break;

            case 'MemberExpression':
                this.visit(node.object, results);
                break;

            case 'Program':
                node.body.forEach(node => this.visit(node, results));
                return results;

            case 'ReturnStatement':
                this.visit(node.argument, results);
                break;

            case 'VariableDeclaration':
                node.declarations.forEach(node => this.visit(node, results));
                break;
        }
    }
};

