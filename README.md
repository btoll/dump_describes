### The Big Idea
I often like to get a bird's-eye view of all of the `describe`s blocks in a Jasmine suite so I can then get a good idea of where to insert my new unit tests.

Using [Esprima], I am recursively finding all of the `describe`s in any given file and then either logging them to `stdout` or creating an `html` document to load in a browser.

### Installation

`npm install https://github.com/btoll/dump_describes.git -g`

### Example

Dump the tree to `stdout`:

    dump_describes -f Filters.js

![ScreenShot](/resources/screenshots/dump_describes_log.png?raw=true)

Create an `html` document of the same tree:

    dump_describes -f Filters.js --html

![ScreenShot](/resources/screenshots/dump_describes_html.png?raw=true)

Redirect:

    dump_describes -f Filters.js --html > foo

Pipe:

    dump_describes -f Filters.js | tee foo

weeeeeeeeeeeeeeeeeeeeeeeeeeeeeee!!!!!!!!!!!!!!!!

[Esprima]: http://esprima.org/

