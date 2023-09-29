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
      if (code) rej(new Error(`Exited with ${code}`));
      else res(code);
    });
  });

// const GIT = require('simple-git');
const {
  TEMPLATE_DIR = './template',
  BACKUP_DIR = './backup',
  SOURCE_BRANCH = 'source',
} = process.env;

Promise.resolve()
  .then(async () => {
    // move existing to backup
    await fsp.mkdir(BACKUP_DIR, { recursive: true });
    const existing = await fsp.stat(TEMPLATE_DIR).catch(() => {});
    if (existing) {
      fsp.rename(TEMPLATE_DIR, path.join(BACKUP_DIR, [TEMPLATE_DIR, Date.now()].join('.')));
    }

    // clone source branch into template dir
    await exec('git', [
      'clone',
      `file://${process.cwd()}`,
      '--depth=1',
      '-b',
      SOURCE_BRANCH,
      TEMPLATE_DIR,
    ]);
    await fsp.rm(path.join(TEMPLATE_DIR, '.git'), { recursive: true });

    // replace name, description in package.json for template
    await exec('npx', [
      'replace-in-file',
      '"@kennyhyun/create-react-component"',
      '"{{name}}"',
      './template/package.json',
    ]);
    await exec('npx', [
      'replace-in-file',
      '"description": ""',
      '"description": "{{description}}"',
      './template/package.json',
    ]);
    // remove template scripts from package.json
    await exec('npx', [
      'replace-in-file',
      '/[ ]+"publish:template": ".*",\\n/',
      '',
      './template/package.json',
      '--isRegex',
    ]);
    await exec('npx', [
      'replace-in-file',
      '/[ ]+"gh-pages": ".*",\\n/',
      '',
      './template/package.json',
      '--isRegex',
    ]);
    await exec('npx', [
      'replace-in-file',
      '/[ ]+"replace-in-file": ".*",\\n/',
      '',
      './template/package.json',
      '--isRegex',
    ]);

    await fsp.rm(path.join(TEMPLATE_DIR, 'bin', 'templatize.js'));
    await fsp.rm(path.join(TEMPLATE_DIR, 'pnpm-lock.yaml'));

    // throw new Error('test');
    // publish into template branch using gh-pages
    await exec('npx', ['gh-pages', '-d', 'template', '-b', 'template', '-t']);
    await fsp.rm(TEMPLATE_DIR, { recursive: true });
  })
  .catch(e => console.error(e.message));
