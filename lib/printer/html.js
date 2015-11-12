(() => {
    'use strict';

    module.exports = Object.setPrototypeOf({
        captureRow: function (name, type) {
            this.rows.push(
                // TODO: Does this need to be optimized?
                `<p style="padding-left: ${this.indent * 50}px;" class="${this.indent < 2 ? 'stripe' : ''}"><span class="${type}">${type === 'it' ? 'it -&gt; ' : '(describe)'}</span>${name}</p>\n`
            );
        },

        init: function (results, verbose) {
            return new Promise((resolve, reject) => {
                for (let m of results.entries()) {
                    let suiteName = m[0],
                        // Trim quotes from the begin and end of the suiteName.
                        newFile = suiteName.replace(/^['"]|['"]$/g, '') + '_suite.html',
                        curried = this.makeTpl.bind(null, suiteName),
                        tpl;

                    this.print(m[1], verbose);
                    tpl = curried(this.rows.join(''));

                    require('fs').writeFile(newFile, tpl, 'utf8', (err) => {
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
                        background: #726d6d;
                        border: 0px solid #000;
                        border-top-width: 2px;
                        color: #fff;
                        font-weight: normal;
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

                    span.describe {
                        color: #207ab2;
                        margin-right: 5px;
                    }

                    span.it {
                        color: #eab560;
                    }
                </style>
                </head>

                <body>
                    <h3>${header}</h3>
                    ${suite}
                </body>
                </html>
            `;
        }
    }, require('./printer'));
})();

