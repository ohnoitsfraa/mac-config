const install = require('./install.json');
const chalk = require('chalk');
const cmd = require('node-cmd');
const log = console.log;
const inquirer = require('inquirer');
const defaultChoices = [
    {
        value: 'all',
        name: 'Install all'
    },
    new inquirer.Separator()
];
const inquirerConfig = [
    {
        type: 'list',
        name: 'appChoice',
        message: 'Which apps do you want to install?',
        choices: [
            ...defaultChoices,
            ...install
        ],
        pageSize: install.length + defaultChoices.length
    }
];

const run = async () => {
    try {
        const answers = await inquirer.prompt(inquirerConfig);
        const item = install.find(item => item.value === answers[inquirerConfig[0].name])
        if (item) {
            runCommands(item);
        } else {
            log(chalk.red(`:: ${answers[inquirerConfig[0].name]} could not be found in install.json`));
        }
    } catch (err) {
        log(chalk.red(err));
    }
};

const runCommands = async (item) => {
    if (item && item.commands && item.commands.length > 0) {
        log(chalk.green(`:: installing ${item.name} ::`))
        const funcs = item.commands.map((command) => {
            return () => {
                return new Promise((resolve, reject) => {
                    cmd.get(command, (err, data) => {
                        if (err) {
                            log(chalk.red(err));
                            reject(err);
                        }
                        log(chalk.green(data));
                        resolve(data);
                    });
                });
            }
        });
        runPromisesSequentially(funcs);
    }
}

const runPromisesSequentially = (funcs) =>
    funcs.reduce((promise, func) => promise.then(result => func().then(Array.prototype.concat.bind(result))), Promise.resolve([]));

run();