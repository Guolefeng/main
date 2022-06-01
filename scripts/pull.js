const { exec, which, exit } = require('shelljs')
const chalk = require('chalk')

const log = console.log

const logErrorAndExit = (err) => {
    log(chalk.red(err))
    exit(1)
}

// 检查控制台是否可以运行'git'开头的命令
if (!which('git')) {
    // 在控制台输出内容
    logErrorAndExit('Error: sorry, this script requires git')
}

if (exec('git pull').code !== 0) {
    logErrorAndExit('Error: Git pull failed')
}

if (test('-e', '.gitmodules')) {
    if (exec('git submodule foreach git pull').code !== 0) {
        logErrorAndExit('Error: Git submodule pull failed')
    }
    
    if (exec('git submodule update').code !== 0) {
        logErrorAndExit('Error: Git submodule update failed')
    }
}

log(chalk.green('🎉🎉🎉pull successful🎉🎉🎉'))