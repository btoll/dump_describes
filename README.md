### The Big Idea
I often like to get a bird's-eye view of all of the `describe` blocks in a Jasmine suite so I can then get a good idea of where to insert my new unit tests.

Using [Esprima], I am recursively finding all of the `describe`s in any given file and then either logging them to `stdout` or creating an `html` document to load in the browser.

Note that the default is to only dump the `describe` blocks. If the nested `it` blocks are also desired, add the `--verbose` flag.

### Installation

`npm install https://github.com/btoll/dump_describes.git -g`

### About

The top-most `describe` block which wraps the entire suite will be used as the name of the produced output and will lend its name to the generated `html` file (if the `--html` switch was given).

There are two ways to produce output; reading from a file or reading from `stdin`.

For instance, when transpiling from another language into JavaScript, it can be useful to pipe the results of the transpilation to `dump_describes`. This is useful and avoids the intermediary step of saving to a file.

For example, the following pipeline takes the transpiled JavaScript produced by the `coffee` binary and passes it to `dump_describes`:

    coffee -p suite.coffee | dump_describes

Also, note that the describe blocks are collapsible in the `html` view.

The following Jasmine identifiers are supported:
- `describe`
- `fdescribe`
- `xdescribe`
- `it`
- `fit`
- `xit`

### Examples

Read from `stdin`:

    cat suite.js | dump_describes -v

    coffee -p suite.coffee | dump_describes -v --html

Redirect:

    dump_describes -f Filters.js > foo

Pipe:

    dump_describes -f Filters.js | tee foo

Dump the tree to `stdout` (defaults to only the `describe` blocks):

    dump_describes -f Filters.js

![ScreenShot](/screenshots/log.png?raw=true)

Dump all `describe` and `it` blocks to `stdout`:

    dump_describes -f Filters.js --verbose

![ScreenShot](/screenshots/log_verbose.png?raw=true)

Create an `html` document of the same tree:

    dump_describes -f Filters.js --html

![ScreenShot](/screenshots/html.png?raw=true)

Create an `html` document of all `describe` and `it` blocks:

    dump_describes -f Filters.js --html --verbose

![ScreenShot](/screenshots/html_verbose.png?raw=true)

### Usage

    Property | Description
    ------------ | -------------
    -f, --file | The suite to parse
    --html | Creates an html document of the tree
    -v, --verbose | Dumps `it` blocks
    -h, --help | Show help

Weeeeeeeeeeeeeeeeeeeeeeeeee!!!!!!!!!!!!!!

[Esprima]: http://esprima.org/

