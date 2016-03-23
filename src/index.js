/* eslint-disable no-console */
'use strict';

(() => {
    const esprima = require('esprima'),
        chalk = require('chalk'),
        visitor = require('./lib/visitor'),
        fs = require('fs');

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
            throw new Error(`${chalk.red('[ERROR]')} No file given`);
        }

        if (!printer) {
            throw new Error(`${chalk.red('[ERROR]')} No printer given`);
        }

        // TODO: Keep this?
//        console.log('Just a moment while we crunch your suite...');

        return getSuite(file, isData)
        .then(suite => {
            const contents = visitTree(suite, verbose);

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

