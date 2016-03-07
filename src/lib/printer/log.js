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
        init: function (results, verbose) {
            // Usually not needed to reset `rows` list except when running tests.
            rows.length = 0;

            // A Promise isn't strictly necessary here.
            return new Promise((resolve) => {
                for (let entry of results.entries()) {
                    rows.push(`Test suite ${entry[0]}`);
                    this.print(entry[1].map, verbose);
                }

                resolve(rows.join('\n'));
            });
        },

        captureRow: function (name, type) {
            let t = type.indexOf('describe') > -1 ?
                `(${type})` :
                `${type} ->`;

            rows.push(`${getTabs(this.indent)} ${t} ${name}`);
        }
    }, printer);
})();

