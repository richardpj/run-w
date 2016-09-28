#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2)),
    lib = require('../lib');

const getPackageTasks = lib.getPackageTasks,
    matchtasks = lib.matchtasks,
    runW = lib.runW;

runW(matchtasks(argv._, getPackageTasks())).catch(
    (err) => {
        throw err;
    }
);
