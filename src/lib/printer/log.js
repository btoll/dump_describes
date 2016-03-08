/* eslint-disable no-console */
'use strict';

(() => {
    let getTabs = (indent) => {
        let tabs = '';

        while (indent) {
            return getTabs(--indent) + '\t';
        }

        return tabs;
    },
    rows = [],
    printer = require('./printer');

    module.exports = Object.setPrototypeOf({
        print: function (results, verbose) {
            // Usually not needed to reset `rows` list except when running tests.
            rows.length = 0;

            // A Promise isn't strictly necessary here.
            return new Promise((resolve) => {
                for (let entry of results.entries()) {
                    rows.push(`Test suite ${entry[0]}`);
                    this.makeNode(entry[1].map, verbose);
                }

                resolve(rows.join('\n'));
            });
        },

        makeNode: (() => {
            function getRow(name, type) {
                let t = type.indexOf('describe') > -1 ?
                    `(${type})` :
                    `${type} ->`;

                rows.push(`${getTabs(this.indent)} ${t} ${name}`);
            }

            return function (map, verbose) {
                this.indent++;

                for (let entry of map.entries()) {
                    let entry1 = entry[1],
                        map = entry1.map;

                    getRow.call(this, entry[0], (verbose && !map ? entry1 : entry1.identifier));

                    if (map && map.size) {
                        this.makeNode(map, verbose);
                    }
                }

                this.indent--;
            };
        })()
    }, printer);
})();

