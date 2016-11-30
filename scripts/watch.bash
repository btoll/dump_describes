#!/bin/bash

if which entr > /dev/null; then
    shopt -s globstar
    ls ./src/**/*.js ./spec/*spec.js | entr -c npm run specs
else
    echo "$(tput setaf 1)[ERROR]$(tput sgr0) This script has a dependency on entr (http://entrproject.org/) to watch files."
    exit 1
fi

