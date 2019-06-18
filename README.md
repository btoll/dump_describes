# dump_describes

[![Build Status](https://travis-ci.org/btoll/dump_describes.svg?branch=master)](https://travis-ci.org/btoll/dump_describes)
[![Coverage Status](https://coveralls.io/repos/github/btoll/dump_describes/badge.svg?branch=master)](https://coveralls.io/github/btoll/dump_describes?branch=master)
[![npm](https://img.shields.io/npm/v/dump_describes.svg)](https://www.npmjs.com/package/dump_describes)

**dump_describes** is a tool that provides a high-level view of all of the `describe` and `it` blocks in a test suite.  This is useful to quickly gain familiarity with a particular suite and to easily determine where to insert new tests.

Any testing framework that uses `describe` and `it` blocks to define a suite is supported, such as [Jasmine], [Mocha] and [Jest].

## How It Works

**dump_describes** uses [Esprima] to parse the given JavaScript and create an AST. This is then recursively walked to find all of the `describe` blocks and, optionally, all of the `it` blocks. The results are either logged to `stdout` or written to an `html` document.

The top-most `describe` block which wraps the entire suite will be used as the name of the produced output and will lend its name to the generated `html` file (if the `--html` switch is given).

When transpiling from another language into JavaScript, it can be useful to pipe the results of the transpilation to `dump_describes`. This is useful and avoids the intermediary step of having to save to a file:

    coffee -p suite.coffee | dump_describes

By default, **dump_describes** will only dump the `describe` blocks. Use the `--verbose` flag to also dump the `it` blocks.

The following identifiers are supported:

+ `describe`
+ `fdescribe`
+ `xdescribe`
+ `it`
+ `fit`
+ `xit`

## Installation

`npm install https://github.com/btoll/dump_describes.git -g`

## Usage

    Property | Description
    ------------ | -------------
    --active | List only active blocks (i.e., `fdescribe`, `fit`)
    --inactive | List only inactive blocks (i.e., `xdescribe`, `xit`)
    --destination, -d | [Optional] The location to save the output (defaults to $PWD)
    --html | Creates an html document of the tree
    --markdown, --md | Creates a markdown document of the tree
    --target, -t | The target suite to parse
    --debug | Turns on debug mode
    --verbose, -v | Also dumps `it` blocks
    --help, -h | Show help

## Examples

Test on the CLI by piping into `stdin`:

    cat | dump_describes -v

At which point enter the following snippet, followed by Ctrl-D:

    describe('test', () => {
        describe('foo', () => {
            it('should derp', () => {
            });
        });
    });

The following will dump the result of processing the `Filters.js` suite to `stdout`:

    dump_describes -t Filters.js

Also, print debugging information:

    dump_describes --debug -t Filters.js

Also, dump `it` blocks:

    dump_describes -t Filters.js -v

Only dump the 'active' `fdescribe` blocks to `stdout`:

    dump_describes -t Filters.js --active

Same as the previous, but in addition dump 'active' `fit` blocks to `stdout`:

    dump_describes -t Filters.js --active

Only dump the 'inactive' `xdescribe` blocks to `stdout`:

    dump_describes -t Filters.js --inactive

Same as the previous, but in addition dump 'inactive' `xit` blocks to `stdout`:

    dump_describes -t Filters.js --inactive -v

Create an `html` document of the same tree produced by the previous command (`describe` nodes can be expanded/collapsed):

    dump_describes -t Filters.js -v --html

Create an `markdown` document of the same tree produced by the previous command (`describe` nodes can be expanded/collapsed):

    dump_describes -t Filters.js -v --md

Pipe:

    coffee -p suite.coffee | dump_describes -v --html

    cat suite.js | dump_describes -v

    dump_describes -t Filters.js | tee foo

Let's get fancy and open a file from the internet in the default browser:

    curl https://raw.githubusercontent.com/btoll/dump_describes/master/spec/dump_describes_spec.js |
        dump_describes -v --html |
        cut -d' ' -f2 |
        xargs open

* Note that the above pipeline is using `open` which is an OS X tool.

## Creating a Custom Code Generator

**dump_describes** ships with three generators, [LOG], [HTML] and [MARKDOWN].

However, it's very easy to create a generator. The only stipulation is that the generator module expose a `print` method, which is called with the node results and the value of `verbose`.

`print` must return a Promise, which in turn will resolve with the list of transformed results or a simple message or something else, depending on the requirements.

## Using with Vim

I use the following command abbreviations to view a suite from within Vim.

Typing `:dd` followed by a [[space]] will become `:!clear && dump_describes -t %`:

    autocmd FileType javascript cnoreabbrev <expr> dd getcmdtype() == ":" && getcmdline() == 'dd' ? '!clear && dump_describes -t %' : 'dd'

Typing `:ddv` followed by a [[space]] will become `:!clear && dump_describes -t % -v`:

    autocmd FileType javascript cnoreabbrev <expr> ddv getcmdtype() == ":" && getcmdline() == 'ddv' ? '!clear && dump_describes -t % -v' : 'ddv'

## Screenshots

![ScreenShot](https://raw.github.com/btoll/i/master/dump_describes/log.png)
![ScreenShot](https://raw.github.com/btoll/i/master/dump_describes/log_verbose.png)
![ScreenShot](https://raw.github.com/btoll/i/master/dump_describes/html.png)
![ScreenShot](https://raw.github.com/btoll/i/master/dump_describes/html_verbose.png)

## Known Issues

The following nodes are not yet supported and parsing them will produce surprising and unexpected results (even errors):

- ForStatement
- ForInStatement
- ForOfStatement
- DoWhileStatement
- WhileStatement

## License

[GPLv3](COPYING)

## Author

Benjamin Toll

[Esprima]: http://esprima.org/
[Jasmine]: http://jasmine.github.io/
[Mocha]: http://mochajs.org/
[Jest]: https://jestjs.io/
[HTML]: /src/generator/html.js
[LOG]: /src/generator/log.js
[MARKDOWN]: /src/generator/markdown.js

