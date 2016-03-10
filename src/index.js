/* eslint-disable no-console */
'use strict';

(() => {
    let esprima = require('esprima'),
        visitor = require('./lib/visitor'),
        fs = require('fs');

    function getSuite(file, isData) {
        return new Promise((resolve, reject) => {
            if (isData) {
                resolve(file);
            } else {
                fs.readFile(file, 'utf8', (err, fileContents) => {
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
        if (!file) {
            throw new Error('dump_describes: No file given');
        }

        if (!printer) {
            throw new Error('dump_describes: No printer given');
        }

        console.log('Just a moment while we crunch your suite...');

        return getSuite(file, isData)
        .then(suite => {
            let contents = visitTree(suite, verbose);

            if (!contents.size) {
                return `dump_describes: No results found for suite ${file}`;
            } else {
                return printer.print(contents, verbose);
            }
        });
    }

    function visitTree(suite, verbose) {
        visitor.verbose = !!verbose;
        return visitor.visit(esprima.parse(suite), new Map());
    }

    module.exports = makeTree;
})();

