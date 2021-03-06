'use strict';

const transformer = require('onf-static/src/transformer');

const getRow = (name, type) => {
    if (~type.indexOf('describe')) {
        rows.push(
            (indent === 1) ?
                `\n###(describe) ${name}` :
                `\n${getTabs(indent)}(describe) ${name}`
        );
    } else {
        rows.push(
            (indent === 1) ?
                // Target top-level `it` blocks (make an unordered list).
                `- it -> ${name}` :
                `${getTabs(indent)} it -> ${name}`
        );
    }
};

const getTabs = indent => {
    if (indent < 2) {
        return '';
    }

    const tabs = '\t';

    return `${tabs}${getTabs(--indent)}`;
};

const makeNode = (map, verbose) => {
    indent++;

    for (const entry of map.entries()) {
        const entry1 = entry[1],
            map = entry1.map;

        let expectation = entry[0].reduce((acc, curr) => {
            acc += transformer.getNodeValue(curr);
            return acc;
        }, '');

        getRow(expectation, (verbose && !map ? entry1 : entry1.identifier));

        if (map && map.size) {
            makeNode(map, verbose);
        }
    }

    indent--;
};

const print = (results, options) => {
    // Usually not needed to reset `rows` list except when running tests.
    rows.length = 0;

    // A Promise isn't strictly necessary here.
    return new Promise((resolve, reject) => {
        for (const entry of results.entries()) {
            const suiteName = entry[0].reduce((acc, curr) => {
                acc += transformer.getNodeValue(curr);
                return acc;
            }, '');

            // Trim quotes from the begin and end of the suiteName.
            const newFile = `${options.destination}/${suiteName.replace(/^['"]|['"]$/g, '')}_suite.md`;

            rows.push(`##Test suite ${suiteName}`);
            makeNode(entry[1].map, options.verbose);

            require('fs').writeFile(newFile, rows.join('\n'), 'utf8', err => {
                if (err) {
                    reject('Oh no, something went wrong!');
                } else {
                    resolve(`Suite ${newFile} created successfully!`);
                }
            });
        }
    });
};

const rows = [];
let indent = 0;

module.exports = {
    print
};

