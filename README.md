# dump_describes

**dump_describes** is a tool that provides a high-level view of all of the `describe` and `it` blocks in a [Jasmine] test suite.  This can be useful to quickly gain familiarity with a particular suite and to easily determine where to insert new tests.

**dump_describes** uses [Esprima] to parse the given JavaScript and create an AST. This is then recursively walked to find all of the `describe` blocks and, optionally, all of the `it` blocks. The results are either logged to `stdout` or written to an `html` document.

The top-most `describe` block which wraps the entire suite will be used as the name of the produced output and will lend its name to the generated `html` file (if the `--html` switch is given).

When transpiling from another language into JavaScript, it can be useful to pipe the results of the transpilation to `dump_describes`. This is useful and avoids the intermediary step of having to save to a file:

    coffee -p suite.coffee | dump_describes

By default, **dump_describes** will only dump the `describe` blocks. Use the `--verbose` flag to also dump the `it` blocks.

The following Jasmine identifiers are supported:

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
    -f, --file | The suite to parse
    --html | Creates an html document of the tree
    -v, --verbose | Also dumps `it` blocks
    -h, --help | Show help

## Examples

The following will dump the result of processing the `Filters.js` suite to `stdout`:

    dump_describes -f Filters.js

Also, dump `it` blocks:

        dump_describes -f Filters.js -v

Create an `html` document of the same tree produced by the previous command (`describe` nodes can be expanded/collapsed):

    dump_describes -f Filters.js -v --html

Pipe:

    coffee -p suite.coffee | dump_describes -v --html

    cat suite.js | dump_describes -v

    dump_describes -f Filters.js | tee foo

## Using with Vim

I use the following command abbreviations to view a suite from within Vim.

Typing `:dd` followed by a [[space]] will become `:!clear && dump_describes -f %`:

    autocmd FileType javascript cnoreabbrev <expr> dd getcmdtype() == ":" && getcmdline() == 'dd' ? '!clear && dump_describes -f %' : 'dd'

Typing `:ddv` followed by a [[space]] will become `:!clear && dump_describes -f % -v`:

    autocmd FileType javascript cnoreabbrev <expr> ddv getcmdtype() == ":" && getcmdline() == 'ddv' ? '!clear && dump_describes -f % -v' : 'ddv'

## Screenshots

![ScreenShot](https://raw.github.com/btoll/i/master/dump_describes/log.png)
![ScreenShot](https://raw.github.com/btoll/i/master/dump_describes/log_verbose.png)
![ScreenShot](https://raw.github.com/btoll/i/master/dump_describes/html.png)
![ScreenShot](https://raw.github.com/btoll/i/master/dump_describes/html_verbose.png)

[Esprima]: http://esprima.org/
[Jasmine]: http://jasmine.github.io/

## License

[MIT](LICENSE)

## Author

Benjamin Toll

