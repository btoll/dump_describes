'use strict';

(() => {
    const getTabs = indent => {
        const tabs = '';

        while (indent) {
            return `${getTabs(--indent)} \t`;
        }

        return tabs;
    },
    rows = [];
    let indent = 0;

    module.exports = {
        print: function (results, verbose) {
            // Usually not needed to reset `rows` list except when running tests.
            rows.length = 0;

            // A Promise isn't strictly necessary here.
            return new Promise(resolve => {
                for (const entry of results.entries()) {
                    rows.push(`Test suite ${entry[0]}`);
                    this.makeNode(entry[1].map, verbose);
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

                    getRow(entry[0], (verbose && !map ? entry1 : entry1.identifier));

                    if (map && map.size) {
                        this.makeNode(map, verbose);
                    }
                }

                indent--;
            };
        })()
    };
})();

