'use strict';

const reDescribe = /^[f|x]?describe/;
const reFDescribe = /^fdescribe/;
const reXDescribe = /^xdescribe/;
const reIt = /^[f|x]?it/;
const reFIt = /^fit/;
const reXIt = /^xit/;

let testDescribeBlock = (name, options) => {
    const re = options.active ? reFDescribe :
        options.inactive ? reXDescribe :
        reDescribe;

    // Memoize.
    testDescribeBlock = name => re.test(name);

    return testDescribeBlock(name);
};

let testItBlock = (name, options) => {
    const re = options.active ? reFIt :
        options.inactive ? reXIt :
        reIt;

    // Memoize.
    testItBlock = name => re.test(name);

    return testItBlock(name);
};

module.exports = {
    refs: {
        CallExpression(node, parent, results) {
            const callArgs = node.arguments;
            const callee = node.callee;
            const name = callee.name;

            if (testDescribeBlock(name, this.options)) {
                const block = {
                    identifier: name,
                    map: new Map()
                };

                results.set(callArgs.slice(0, -1), block);
                this.visit(callArgs.slice(-1)[0].body, node, block.map);
            } else if (this.options.verbose && testItBlock(name, this.options)) {
                results.set([callArgs[0]], name);
            // TODO: Is this last block necessary?
            } else {
                callArgs.forEach(arg => this.visit(arg, node, results));

                if (callee) {
                    this.visit(callee, node, results);
                }
            }
        },

        ReturnStatement(node, parent, results) {
            const nodeArgument = node.argument;

            if (nodeArgument) {
                const returnArgs = nodeArgument.arguments;

                if (returnArgs) {
                    returnArgs.forEach(node => {
                        // As long as of the type isn't (Arrow)?FunctionExpression, proceed.
                        // (They will be captured in CallExpression above).
                        if (!~node.type.indexOf('FunctionExpression')) {
                            this.visit(node, parent, results);
                        }
                    });
                }

                this.visit(nodeArgument, node, results);
            }
        }
    },

    setOptions(opts) {
        this.refs.options = opts;
    }
};

