(() => {
    'use strict';

    // We're not worried about putting a counter and a list on the prototype here because each process ends
    // directly after the Promises are resolved and there is only ever one 'child' object created at a time.
    module.exports = Object.create(null, {
        indent: {
            value: 0,
            writable: true
        },

        print: {
            value: function (map) {
                this.indent++;

                for (let entry of map.entries()) {
                    this.captureRow(entry[0]);

                    if (entry[1].size) {
                        this.print(entry[1]);
                    }
                }

                this.indent--;
            }
        },

        rows: {
            value: []
        }
    });
})();

