#!/usr/bin/env node

const fs = require('fs');   

const argv = require('minimist')(process.argv.slice(2));

if(argv._ && argv._.length === 1 && argv._[0]) {
    var fileStream = fs.createWriteStream(argv._[0]);
    process.stdin.pipe(fileStream);
}

process.stdin.pipe(process.stdout);

