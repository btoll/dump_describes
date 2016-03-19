/* eslint-disable no-console */
'use strict';

(() => {
    let esprima = require('esprima'),
        chalk = require('chalk'),
        visitor = require('./lib/visitor'),
        fs = require('fs');

    function displayError(s) {
        return `${chalk.red('[ERROR]')} No ${s} given`;
    }

    function getSuite(file, isData) {
        return new Promise((resolve, reject) => {
            if (isData) {
                resolve(file);
            } else {
                fs.readFile(file, 'utf8', (err, fileContents) => {
                    if (err) {
                        reject(`${chalk.red('[ERROR]')} There was a problem processing the file`);
                    } else {
                        resolve(fileContents);
                    }
                });
            }
        });
    }

    function makeTree(file, printer, verbose, isData) {
        if (!file) {
            return displayError('file');
        }

        if (!printer) {
            return displayError('print');
        }

        // TODO: Keep this?
//        console.log('Just a moment while we crunch your suite...');

        return getSuite(file, isData)
        .then(suite => {
            let contents = visitTree(suite, verbose);

            return !contents.size ?
                `${chalk.yellow('[INFO]')} No results found for suite ${file}` :
                printer.print(contents, verbose);
        });
    }

    function visitTree(suite, verbose) {
        visitor.verbose = !!verbose;
        return visitor.visit(esprima.parse(suite), new Map());
    }

    module.exports = makeTree;
})();

