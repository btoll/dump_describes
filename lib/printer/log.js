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
        init: function (results) {
            // A Promise isn't strictly necessary here.
            return new Promise((resolve) => {
                for (let m of results.entries()) {
                    this.print(m[1]);
                }

                resolve(this.rows.join('\n'));
            });
        },

        captureRow: function (name) {
            this.rows.push(`${getTabs(this.indent)}(describe) ${name}`);
        }
    }, require('./printer'));
})();

