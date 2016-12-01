'use strict';

const esprima = require('esprima'),
    visitor = require('./visitor'),
    fs = require('fs');

function getSuite(file, isData) {
    return new Promise((resolve, reject) => {
        if (isData) {
            resolve(file);
        } else {
            fs.readFile(file, 'utf8', (err, fileContents) => {
                if (err) {
                    reject('There was a problem processing the file');
                } else {
                    resolve(fileContents);
                }
            });
        }
    });
}

function makeTree(file, generator, options, isData) {
    if (!file) {
        throw new Error('[ERROR] No file given');
    }

    if (!generator) {
        throw new Error('[ERROR] No generator given');
    }

    options = options || {};

    return getSuite(file, isData)
        .then(suite => {
            const map = visitTree(suite, options);

            return !map.size ?
                `No results found for suite ${file}` :
                generator.print(map, options);
        });
}

function visitTree(suite, options) {
    const map = new Map();
    map.root = true;

    // TODO: Make better?
    visitor.active = !!options.active;
    visitor.inactive = !!options.inactive;
    visitor.verbose = !!options.verbose;

    return visitor.visit(esprima.parse(suite, {
        sourceType: 'module'
    }), map);
}

module.exports = makeTree;

