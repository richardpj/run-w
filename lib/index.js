'use strict';

const minimatch = require('minimatch'),
    fs = require('fs'),
    path = require('path'),
    exec = require('child_process').exec;

function getPackageTasks(pkgPath) {
    pkgPath = pkgPath || './';
    let packagePath = path.join(pkgPath, 'package.json');

    if (!fs.existsSync(packagePath)) {
        throw new Error('No package.json found');
    }
 
    let packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    return Object.keys(packageJson.scripts);
}

function matchtasks(patterns, tasks) {

    let tasksForMatching = tasks.map((task) => ({ task, escaped: task.replace(":", "/")}));

    return patterns.map((pattern) => minimatch.filter(pattern.replace(":", "/")))
        .map((matchFilter) => 
            tasksForMatching.filter((task) => matchFilter(task.escaped))
                .map((task) => task.task))
        .reduce((prev, next) => prev.concat(next), []);
}

function runW(tasks) {
    var prevProc = null;
    var taskPromises = tasks.map((task) => new Promise((resolve, reject) => {
       let nextProc = exec(`npm run ${task} -s`);
       nextProc.stderr.pipe(process.stderr);
       nextProc.on('close', (code) => code === 0 ? resolve(): reject(new Error(`${dep} ${cmd} exited with code: ${code}`)));
       if(prevProc) {
           prevProc.stdout.pipe(nextProc.stdin);
       }
       prevProc = nextProc;
    }));
    if(prevProc) {
        prevProc.stdout.pipe(process.stdout);
    }
    return Promise.all(taskPromises);
}

module.exports = {
    getPackageTasks,
    matchtasks,
    runW
};