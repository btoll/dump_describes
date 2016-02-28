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
            value: function (map, verbose) {
                this.indent++;

                for (let entry of map.entries()) {
                    let entry1 = entry[1],
                        map = entry1.map;

                    this.captureRow(entry[0], (verbose && !map ? entry1 : entry1.identifier));

                    if (map && map.size) {
                        this.print(map, verbose);
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

