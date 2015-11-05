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

    module.exports = {
        indent: 0,

        init: function (results) {
            for (let m of results.entries()) {
                this.print(m[1]);
            }
        },

        captureRow: function (name) {
            console.log(`${getTabs(this.indent)}(describe) ${name}`);
        },

        print: function (map) {
            let me = this;

            me.indent++;

            for (let entry of map.entries()) {
                me.captureRow(entry[0]);

                if (entry[1].size) {
                    me.print(entry[1]);
                }
            }

            me.indent--;
        }
    };
})();

