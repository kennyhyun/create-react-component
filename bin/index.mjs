#!/usr/bin/env node

import { strict as assert } from 'assert';
import { exec as execSync } from 'child_process';
import fs from "fs";
import path from "path";
import util from "util";
import mustache from "mustache";
import inquirer from "inquirer";
// import fetch from "node-fetch";

const { versions: { node: nodeVersion = '' } } = process;
if (nodeVersion.split('.').shift() < 18) throw new Error('Please use node version 18 or later');

const exec = util.promisify(execSync);

run();

async function run() {
  const gitRepo = await getGitRepo(process.argv[2]);
  const tmpDir = path.join(process.cwd(), ".tmp");
  await fs.promises.rm(tmpDir, { recursive: true }).catch(console.log);

  console.log('Cloning', gitRepo, 'into', tmpDir, process.argv);
  const { stdout, stderr } = await exec(`git clone ${gitRepo} ${tmpDir}`);

  console.log({ stdout, stderr });

  const npmInitFile = path.join(tmpDir, "npm-init.json");
  const templateDir = path.join(tmpDir, ".");
  try {
    await npmInitPkg(npmInitFile, templateDir);
  } catch (e) {
    console.error(e);
  } finally {
    await fs.promises.rm(tmpDir, { recursive: true }).catch(console.log);
  }
}

// check if repo exists and has npm-init.json and template directory
async function getGitRepo(arg) {
  assert(arg, `Invalid repo ${JSON.stringify(arg)}`);
  let gitRepo;

  if (arg) {
    if (arg.match(/^\.+\//)) return arg;
    const argGitRepo = arg.match(/\//) ? arg : 'kennyhyun/create-react-component';
    const gitRepoUrl = `https://github.com/${argGitRepo}`;
    const gitRepoApiUrl = `https://api.github.com/repos/${argGitRepo}`;

    let res1 = await fetch(gitRepoApiUrl);
    let res2 = await fetch(gitRepoApiUrl + "/contents/npm-init.json");
    let res3 = await fetch(gitRepoApiUrl + "/contents/template");
    if (res1.ok && res2.ok && res3.ok) {
      gitRepo = argGitRepo;
    } else {
      console.error(
        "Error: Invalid git repo. It must have npm-init.json and template directory."
      );
    }
  }

  return gitRepo;
}

function updatePackageJson({ filePath, templateDir, targetDir, answers }) {
  const cwd = process.cwd();
  const relativePath = filePath.replace(templateDir, "");
  try {
    const sourceJson = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const packageJson = path.join(targetDir, relativePath.replace('.template', ''));
    const targetJson = JSON.parse(fs.readFileSync(packageJson, 'utf8'));
    Object.keys(sourceJson.devDependencies).forEach(pkg => {
      delete targetJson.devDependencies[pkg];
    });
    targetJson.name = answers.name || answers.projectName || 'a-react-component';
    targetJson.description = answers.description || '';
    fs.writeFileSync(packageJson, JSON.stringify(targetJson, null, 2));
  } catch (e) {
    console.error(e);
  }
}

function npmInitPkg(npmInitFile, templateDir) {
  const npmInit = JSON.parse(fs.readFileSync(npmInitFile, "utf8"));

  const questions = getQuestions(npmInit);
  return inquirer
    .prompt(questions)
    .then(answers => {
      const targetDir = answers.name || answers.projectName;
      console.log("Copying files from template to", targetDir, answers);
      walkDir(templateDir, filePath => {
        if (path.basename(filePath) === 'package.template.json') {
          updatePackageJson({ filePath, templateDir, targetDir, answers });
        } else {
          copyTemplate({ templateDir, targetDir, filePath, answers, npmInit });
        }
      });
      return answers;
    })
    .then(answers => {
      console.info(mustache.render(npmInit.completeMessage, answers));
    })
    .catch(e => console.error(e) && process.exit(1));
}

function getQuestions(npmInit) {
  console.log('npmInit', npmInit);
  const defaultPrompts = {
    projectName: {
      type: "string",
      required: true,
      default: "my-component",
      message: "Component Name"
    }
  };
  const prompts = Object.assign({}, defaultPrompts, npmInit.prompts);
  const questions = [];
  for (var key in prompts) {
    let question = prompts[key];
    question.name = key;
    if (question.required) {
      question.validate = val => Promise.resolve(!!val);
    }
    if (question.type === "string") {
      question.type = "input";
      question.filter = val =>
        Promise.resolve(val.toLowerCase().replace(/\s+/g, "-"));
    }
    questions.push(question);
  }
  return questions;
}

/**
 * copy files from template to project directory
 * params { templateDir, filePath, answers, npmInit }
 */
function copyTemplate({ filePath = '', templateDir = '', targetDir = '', answers = {}, npmInit = {} }) {
  const cwd = process.cwd();
  const relativePath = filePath.replace(templateDir, "");
  const fileContents = fs.readFileSync(filePath, "utf8");

  const outputPath = path.join(cwd, targetDir, relativePath);
  try {
    const outputContents = mustache.render(fileContents, answers);
    fs.outputFileSync(outputPath, outputContents);
  } catch (e) {
    const outputContents = fileContents;
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, outputContents);
  }
}

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}
