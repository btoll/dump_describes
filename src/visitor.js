'use strict';

const reDescribe = /^[f|x]?describe/;
const reFDescribe = /^fdescribe/;
const reXDescribe = /^xdescribe/;
const reIt = /^[f|x]?it/;
const reFIt = /^fit/;
const reXIt = /^xit/;

let testDescribeBlock = name => {
    const options = defaultOptions;
    const re = options.active ? reFDescribe :
        options.inactive ? reXDescribe :
        reDescribe;

    // Memoize.
    testDescribeBlock = name => re.test(name);

    return testDescribeBlock(name);
};

let testItBlock = name => {
    const options = defaultOptions;
    const re = options.active ? reFIt :
        options.inactive ? reXIt :
        reIt;

    // Memoize.
    testItBlock = name => re.test(name);

    return testItBlock(name);
};

let defaultOptions = {
    active: false,
    inactive: false,
    verbose: false
};

module.exports = {
    refs: {
        CallExpression(node, parent, results) {
            const callArgs = node.arguments;
            const callee = node.callee;
            const name = callee.name;

            if (testDescribeBlock(name)) {
                const block = {
                    identifier: name,
                    map: new Map()
                };

                results.set(callArgs.slice(0, -1), block);
                this.visit(callArgs.slice(-1)[0].body, node, block.map);
            } else if (defaultOptions.verbose && testItBlock(name)) {
                results.set([callArgs[0]], name);
            // TODO: Is this last block necessary?
            } else {
                // TODO: Is this necessary?
                callArgs.forEach(arg => this.visit(arg, node, results));

                if (callee && node.type === 'CallExpression') {
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

    getOptions() {
        return defaultOptions;
    },

    setOptions(opts) {
        defaultOptions = Object.assign({}, defaultOptions, opts);
    }
};

