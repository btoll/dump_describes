/* eslint-disable no-console */

(() => {
    'use strict';

    let getTabs = (indent) => {
        let tabs = '';

        while (indent) {
            return getTabs(--indent) + '\t';
        }

        return tabs;
    };

    module.exports = Object.setPrototypeOf({
        init: function (results, verbose) {
            // A Promise isn't strictly necessary here.
            return new Promise((resolve) => {
                for (let entry of results.entries()) {
                    console.log(`Test suite ${entry[0]}`);
                    this.print(entry[1].map, verbose);
                }

                resolve(this.rows.join('\n'));
            });
        },

        captureRow: function (name, type) {
            let t = type.indexOf('describe') > -1 ?
                `(${type})` :
                `${type} ->`;

            this.rows.push(`${getTabs(this.indent)} ${t} ${name}`);
        }
    }, require('./printer'));
})();

