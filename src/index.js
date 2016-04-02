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

    function makeTree(file, printer, options, isData) {
        if (!file) {
            throw new Error(`${chalk.red('[ERROR]')} No file given`);
        }

        if (!printer) {
            throw new Error(`${chalk.red('[ERROR]')} No printer given`);
        }

        options = options || {};

        return getSuite(file, isData)
            .then(suite => {
                const map = visitTree(suite, options);

                return !map.size ?
                    `${chalk.yellow('[INFO]')} No results found for suite ${file}` :
                    printer.print(map, options.verbose);
            });
    }

    function visitTree(suite, options) {
        const map = new Map();
        map.root = true;

        // TODO: Make better?
        visitor.active = !!options.active;
        visitor.inactive = !!options.inactive;
        visitor.verbose = !!options.verbose;

        return visitor.visit(esprima.parse(suite), map);
    }

    module.exports = makeTree;
})();

