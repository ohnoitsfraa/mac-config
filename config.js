const config = require('./config.json');
const chalk = require('chalk');
const cmd = require('node-cmd');
const log = console.log;
const path = require('path');
const fs = require('fs')
const inquirer = require('inquirer');
const defaultChoices = [
    {
        value: 'all',
        name: 'Appy all'
    },
    new inquirer.Separator()
];
const inquirerConfig = [
    {
        type: 'list',
        name: 'configChoice',
        message: 'Which configs do you want to apply?',
        choices: [
            ...defaultChoices,
            ...config
        ],
        pageSize: config.length + defaultChoices.length
    }
];

const run = async () => {
    try {
        const answers = await inquirer.prompt(inquirerConfig);
        const item = config.find(item => item.value === answers[inquirerConfig[0].name]);
        if (item) {
            log(chalk.green(`:: running "${item.value}" for ${item.source}${item.file ? `/${item.file}` : ''} ::`));
            await actions[item.type](item);
            log(chalk.green(`:: done`));
        } else {
            log(chalk.red(`:: ${item.name} could not be found in config.json`));
        }
    } catch (err) {
        log(chalk.red(err));
    }
};

const actions = {
    copy: (file) => {
        return new Promise((res, rej) => {
            let sourcePath;
            let targetPath;
            if (file.file) {
                sourcePath = path.join(file.source, file.file).replace('\n', '');
                targetPath = path.join(file.target, file.file).replace('\n', '');
            } else {
                sourcePath = file.source;
                targetPath = file.target;
            }

            return cmd.get(`cp ${file.file ? '' : '-R'} ${sourcePath} ${targetPath}`, (err, data, stderr) => {
                if (err) {
                    rej(err);
                } else {
                    res(data);
                }
            });
        })
    },
    symlink: (file) => {
        return new Promise((res, rej) => {
            cmd.get('pwd', (err, data, stderr) => {
                if (err) {
                    rej(err);
                } else {
                    const sourcePath = path.join(data, file.source, file.file).replace('\n', '');
                    const targetPath = path.join(file.target, file.file).replace('\n', '');
                    const createLinks = () => {
                        const runSymLinkCmd = () => cmd.get(`ln -s ${sourcePath} ${targetPath}`, (err, data, stderr) => {
                            if (err) {
                                rej(err);
                            } else {
                                res(data);
                            }
                        });
                        if (fs.existsSync(targetPath)) {
                            cmd.get(`rm ${targetPath}`, (err, data) => {
                                if (!err) {
                                    runSymLinkCmd();
                                } else {
                                    log(chalk.red(err));
                                    rej(err);
                                }
                            });
                        } else {
                            runSymLinkCmd();
                        }
                    };
                    if (!fs.existsSync(file.source)) {
                        cmd.get(`mkdir ${file.source}`, (err, data) => {
                            createLinks();
                        });
                    } else {
                        createLinks();
                    }
                }
            });
        });
    }
}

run();