#!/usr/bin/env node

const { promises: fsp } = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const exec = (cmd, args) =>
  new Promise((res, rej) => {
    const subp = spawn(cmd, args);
    const cmdline = [cmd].concat(args).join(' ');
    console.log(`running ${cmdline}`);

    subp.stdout.on('data', data => {
      console.log(`${cmdline}: ${data}`);
    });
    subp.stderr.on('data', data => {
      console.log(`stderr: ${data}`);
    });
    subp.on('error', err => {
      rej(new Error(err));
    });
    subp.on('close', code => {
      res(code);
    });
  });

// const GIT = require('simple-git');
const {
  TEMPLATE_DIR = './template',
  BACKUP_DIR = './backup',
  SOURCE_BRANCH = 'source',
} = process.env;

Promise.resolve().then(async () => {
  // move existing to backup
  await fsp.mkdir(BACKUP_DIR, { recursive: true });
  const existing = await fsp.stat(TEMPLATE_DIR).catch(() => {});
  if (existing) {
    fsp.rename(TEMPLATE_DIR, path.join(BACKUP_DIR, [TEMPLATE_DIR, Date.now()].join('.')));
  }
  // clone current branch into template dir

  await exec('git', ['clone', '.', '--depth=1', '-b', SOURCE_BRANCH, TEMPLATE_DIR]);
  await fsp.rmdir(path.join(TEMPLATE_DIR, '.git'), { recursive: true });

  // replace required
  //# replace name, description in package.json for template
  //# publish into template branch using gh-pages
  // remove template scripts from package.json
});
/*
const git = GIT('.');

console.log(git.status());
*/
