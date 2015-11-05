(() => {
    'use strict';
    let fs = require('fs');

    module.exports = {
        indent: 0,

        captureRow: function (name) {
            this.rows.push(
                `<p style="padding-left: ${this.indent * 50}px;" class="${this.indent < 2 ? 'stripe' : ''}"><span>(describe)</span>${name}</p>\n\t\t`
            );
        },

        init: function (results) {
            return new Promise((resolve, reject) => {
                for (let m of results.entries()) {
                    let suiteName = m[0],
                        newFile = suiteName + '_suite.html',
                        curried = this.makeTpl.bind(null, suiteName),
                        tpl;

                    this.print(m[1]);
                    tpl = curried(this.rows.join(''));

                    fs.writeFile(newFile, tpl, 'utf8', (err) => {
                        if (err) {
                            reject('[ERROR] Oh no, something went wrong!');
                        } else {
                            resolve('Suite ' + newFile + ' created successfully!');
                        }
                    });
                }
            });
        },

        makeTpl: (header, suite) => {
            return `
                <!DOCTYPE html>
                <html>
                <head>
                <meta charset="utf-8">
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                    }

                    h3 {
                        background: #e5a552;
                        border: 0px solid #000;
                        border-top-width: 2px;
                        padding: 10px 10px 10px 20px;
                    }

                    p {
                        padding: 10px;
                    }

                    p.stripe {
                        background: #ddd;
                        border: 0px solid #000;
                        border-top-width: 2px;
                    }

                    span {
                        color: #207ab2;
                        margin-right: 5px;
                    }
                </style>
                </head>

                <body>
                    <h3>${header}</h3>
                    ${suite}
                </body>
                </html>
            `;
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
        },

        rows: []
    };
})();

