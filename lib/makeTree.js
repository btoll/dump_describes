/* eslint-disable no-console */
(() => {
    'use strict';

    let esprima = require('esprima'),
        visitor = require('./visitor');

    function* generateTree(file, printer, verbose) {
        let contents = yield visitTree(file, verbose);
        yield printer.init(contents, verbose);
    }

    function makeTree(file, printer, verbose) {
        // TODO: Need a generator/Promise pattern here.
        let it = generateTree(file, printer, verbose);

        it.next().value.then(function (results) {
            it.next(results).value
                .then(console.log)
                .catch(console.log);
        });
    }

    function visitTree(file, verbose) {
        return new Promise((resolve, reject) => {
            console.log('Just a moment while we crunch your suite...');

            require('fs').readFile(file, 'utf8', (err, fileContents) => {
                if (err) {
                    reject('[ERROR] There was a problem processing the file');
                } else {
                    resolve(visitor.visit(esprima.parse(fileContents), visitor.collect, new Map(), verbose));
                }
            });
        });
    }

    module.exports = makeTree;
})();

