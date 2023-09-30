#!/usr/bin/env node

const readline = require('readline');
const { stdin: input, stdout: output } = require('process');

const { promises: fsp } = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const exec = (cmd, args) =>
  new Promise((res, rej) => {
    const subp = spawn(cmd, args);
    const cmdline = [cmd].concat(args).join(' ');
    console.log(`running ${cmdline}`);
    const strings = [];

    subp.stdout.on('data', data => {
      console.log(`${cmdline}: ${data}`);
      strings.push(data.toString().trim());
    });
    subp.stderr.on('data', data => {
      console.log(`stderr: ${data}`);
    });
    subp.on('error', err => {
      rej(new Error(err));
    });
    subp.on('close', code => {
      if (code) rej(new Error(`Exited with ${code}`));
      else res(strings.join('\n'));
    });
  });

const diffArray = (a, b) => {
  const [anum, ...aarray] = a;
  const [bnum, ...barray] = b;
  const numbers = [anum && Number(anum.trim()), bnum && Number(bnum.trim())];
  if (numbers.every(num => num == null || Number.isNaN(num))) return 0;
  if (numbers[0] === numbers[1]) return diffArray(aarray, barray);
  return numbers[0] - numbers[1];
};

const diffVersions = (a = '', b = '') => {
  const aver = a.split('.');
  const bver = b.split('.');
  return diffArray(aver, bver);
};

const { TEMP_DIR = './.npm.package', SOURCE_BRANCH = 'source' } = process.env;

Promise.resolve()
  .then(async () => {
    await fsp.rm(TEMP_DIR, { recursive: true }).catch(() => {});

    // clone source branch into temp dir
    await exec('git', [
      'clone',
      `file://${process.cwd()}`,
      '--depth=1',
      '-b',
      SOURCE_BRANCH,
      TEMP_DIR,
    ]);
    await fsp.rm(path.join(TEMP_DIR, '.git'), { recursive: true });

    // remove template scripts from package.json
    await exec('npx', [
      'replace-in-file',
      '/[ ]+"publish:template": ".*",\\n/',
      '',
      path.join(TEMP_DIR, 'package.json'),
      '--isRegex',
    ]);
    await exec('npx', [
      'replace-in-file',
      '/[ ]+"postinstall": ".*",\\n/',
      '',
      path.join(TEMP_DIR, 'package.json'),
      '--isRegex',
    ]);

    await fsp.rm(path.join(TEMP_DIR, 'bin', 'templatize.js'));
    await fsp.rm(path.join(TEMP_DIR, 'pnpm-lock.yaml'));

    const existingVersion = await exec('npm', [
      'show',
      '@kennyhyun/create-react-component',
      'version',
    ]).catch(() => '');

    process.chdir(TEMP_DIR);

    const { version: jsonVersion } = JSON.parse(await fsp.readFile('package.json'));
    if (!(diffVersions(jsonVersion, existingVersion) > 0)) {
      await exec('npm', ['version', 'patch']);
      await fsp.cp('package.json', '../package.json').catch(console.warn);
    }

    await exec('npm', ['publish', '--dry-run']);

    const rl = readline.createInterface({ input, output });
    await new Promise((res, rej) => {
      rl.question('Does this look good?: [yes]', answer => {
        rl.close();
        if (answer && answer !== 'yes') {
          rej(new Error('Stops'));
          return;
        }
        // continue to publish
        exec('npm', ['publish', '--access', 'public']).then(res).catch(rej);
      });
    });
    // throw new Error('test');
    // publish into template branch using gh-pages
    // await fsp.rm(TEMP_DIR, { recursive: true });
  })
  .catch(e => console.error(e.message));
