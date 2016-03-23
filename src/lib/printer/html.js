'use strict';

(() => {
    const chalk = require('chalk');
    let indent = 0;

    function makeTpl(header, suite) {
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

    div > p {
        padding: 10px;
    }

    p.stripe {
        background: #ddd;
        border: 0px solid #000;
        border-top-width: 2px;
    }

    span {
        color: #888;
    }

    span.it {
        color: #eab560;
    }

    span.describe {
        color: #207ab2;
        margin-right: 5px;
    }

    span + span {
        color: #000;
        font-weight: bold;
    }

    span.fdescribe + span,
    span.xdescribe + span {
        color: green;
    }

    span.fit + span,
    span.xit + span {
        color: green;
    }

    a:link,
    a:visited,
    a:hover,
    a:active {
        color: #207ab2;
    }

    span.fdescribe a:link,
    span.fdescribe a:visited,
    span.fdescribe a:hover,
    span.fdescribe a:active,

    span.xdescribe a:link,
    span.xdescribe a:visited,
    span.xdescribe a:hover,
    span.xdescribe a:active {
        color: #888;
    }
</style>
</head>

<body>
    <h3>Test suite ${header}</h3>
    ${suite}

    <script>
    'use strict';

    document.body.addEventListener('click', event => {
        const target = event.target;

        if (target.tagName.toUpperCase() === 'A') {
            const style = target.parentNode.parentNode.nextElementSibling.style;

            style.display = (style.display === 'none') ?
                'block' :
                'none';
        }

        event.preventDefault();
    });
    </script>
</body>
</html>
        `;
    }

    module.exports = {
        print: function (results, verbose) {
            return new Promise((resolve, reject) => {
                for (const m of results.entries()) {
                    const suiteName = m[0],
                        // Trim quotes from the begin and end of the suiteName.
                        newFile = suiteName.replace(/^['"]|['"]$/g, '') + '_suite.html';
                    let tpl;

                    tpl = makeTpl(suiteName, this.makeNode(m[1].map, [], verbose));

                    require('fs').writeFile(newFile, tpl, 'utf8', err => {
                        if (err) {
                            reject(`${chalk.red('[ERROR]')} Oh no, something went wrong!`);
                        } else {
                            resolve(`Suite ${newFile} created successfully!`);
                        }
                    });
                }
            });
        },

        makeNode: (() => {
            function getRow(name, type) {
                return `<p class="${indent < 2 ? 'stripe' : ''}">
                    <span class="${type}">
                        ${
                            type.indexOf('describe') > -1 ?
                            `(<a href="#">${type}</a>)` :
                            `${type} -> `
                        }
                    </span>
                    <span>${name}</span>
                </p>`;
            }

            return function (map, buf, verbose) {
                indent++;

                for (const entry of map.entries()) {
                    const entry1 = entry[1],
                        map = entry1.map,
                        leftPadding = !(indent < 2) ? 'padding-left: 50px;' : '';

                    if (map || !verbose) {
                        const child = [];

                        buf.push(`<div style="${leftPadding}">`);
                        child.push(getRow(entry[0], entry1.identifier));

                        // Note that will send an enclosing DIV to wrap all the children for
                        // the collapse/expand behavior.
                        child.push(
                            this.makeNode(map, ['<div>'], verbose),
                            '</div>'
                        );

                        buf.push(child.join(''), '</div>');
                    } else {
                        buf.push(
                            `<div style="${leftPadding}">`,
                            getRow.call(this, entry[0], entry1),
                            '</div>'
                        );
                    }
                }

                indent--;

                return buf.join('');
            };
        })()
    };
})();

