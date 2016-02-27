/* eslint-disable no-console */
(() => {
    'use strict';

    let esprima = require('esprima'),
        visitor = require('./lib/visitor');

    function getSuite(file, isData) {
        return new Promise((resolve, reject) => {
            if (isData) {
                resolve(file);
            } else {
                require('fs').readFile(file, 'utf8', (err, fileContents) => {
                    if (err) {
                        reject('[ERROR] There was a problem processing the file');
                    } else {
                        resolve(fileContents);
                    }
                });
            }
        });
    }

    function makeTree(file, printer, verbose, isData) {
        getSuite(file, isData)
        .then((suite) => {
            let contents = visitTree(suite, verbose);
            return printer.init(contents, verbose);
        })
        .then(console.log)
        .catch(console.log)
    }

    function visitTree(suite, verbose) {
        console.log('Just a moment while we crunch your suite...');
        return visitor.visit(esprima.parse(suite), new Map(), verbose);
    }

    module.exports = makeTree;
})();

