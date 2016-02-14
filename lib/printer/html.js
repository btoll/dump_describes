(() => {
    'use strict';

    module.exports = Object.setPrototypeOf({
        makeChildNode: function (name, type) {
            return `<p class="${this.indent < 2 ? 'stripe' : ''}">
                <span class="${type}">
                    ${
                        type.indexOf('describe') > -1 ?
                        `(<a href="#">${type}</a>)` :
                        `${type} -> `
                    }
                </span>
                <span>${name}</span>
            </p>`;
        },

        init: function (results, verbose) {
            return new Promise((resolve, reject) => {
                for (let m of results.entries()) {
                    let suiteName = m[0],
                        // Trim quotes from the begin and end of the suiteName.
                        newFile = suiteName.replace(/^['"]|['"]$/g, '') + '_suite.html',
                        tpl;

                    tpl = this.makeTpl(suiteName, this.print(m[1].map, [], verbose));

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

    document.body.addEventListener('click', (event) => {
        let target = event.target;

        if (target.tagName.toUpperCase() === 'A') {
            let style = target.parentNode.parentNode.nextElementSibling.style;

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
        },

        print: function (map, buf, verbose) {
            this.indent++;

            for (let entry of map.entries()) {
                let entry1 = entry[1],
                    map = entry1.map,
                    leftPadding = !(this.indent < 2) ? 'padding-left: 50px;' : '';

                if (map || !verbose) {
                    let child = [];

                    buf.push(`<div style="${leftPadding}">`);
                    child.push(this.makeChildNode(entry[0], entry1.identifier));

                    // Note that will send an enclosing DIV to wrap all the children for
                    // the collapse/expand behavior.
                    child.push(this.print(map, ['<div>'], verbose));
                    child.push('</div>');

                    buf.push(child.join(''), '</div>');
                } else {
                    buf.push(`<div style="${leftPadding}">`);
                    buf.push(this.makeChildNode(entry[0], entry1));
                    buf.push('</div>');
                }
            }

            this.indent--;

            return buf.join('');
        }
    }, require('./printer'));
})();

