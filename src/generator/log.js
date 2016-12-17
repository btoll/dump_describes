'use strict';

const transformer = require('../transformer');
const rows = [];
const getTabs = indent => {
    if (indent < 2) {
        return '';
    }

    const tabs = '\t';

    return `${tabs}${getTabs(--indent)}`;
};

let indent = 0;

module.exports = {
    print: function (results, options) {
        // Usually not needed to reset `rows` list except when running tests.
        rows.length = 0;

        // A Promise isn't strictly necessary here.
        return new Promise(resolve => {
            for (const entry of results.entries()) {
                let suiteName = entry[0].reduce((acc, curr) => {
                    acc += transformer.getNodeValue(curr);
                    return acc;
                }, '');

                rows.push(`Test suite ${suiteName}`);
                this.makeNode(entry[1].map, options.verbose);
            }

            resolve(rows.join('\n'));
        });
    },

    makeNode: (() => {
        function getRow(name, type) {
            const t = type.indexOf('describe') > -1 ?
                `(${type})` :
                `${type} ->`;

            rows.push(`${getTabs(indent)} ${t} ${name}`);
        }

        return function (map, verbose) {
            indent++;

            for (const entry of map.entries()) {
                const entry1 = entry[1],
                    map = entry1.map;

                let expectation = entry[0].reduce((acc, curr) => {
                    acc += transformer.getNodeValue(curr);
                    return acc;
                }, '');

                getRow(expectation, (verbose && !map ? entry1 : entry1.identifier));

                if (map && map.size) {
                    this.makeNode(map, verbose);
                }
            }

            indent--;
        };
    })()
};

