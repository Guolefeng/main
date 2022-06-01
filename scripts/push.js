const { exec, exit, which, test } = require('shelljs')
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

if (test('-e', '.gitmodules')) {
    if (exec('git submodule foreach "git add . || true"').code !== 0) {
        logErrorAndExit('Error: Git submodule "add failed || true"')
    }
    
    if (exec('git submodule foreach "git commit -am \"auto-commit\" || true"').code !== 0) {
        logErrorAndExit('Error: Git submodule commit failed')
    }
    
    if (exec('git submodule foreach "git push || true"').code !== 0) {
        logErrorAndExit('Error: Git submodule push failed')
    }
}

exec('git add .')
exec('git commit -am "auto-commit"')
exec('git push')

log(chalk.green('🎉🎉🎉push successful🎉🎉🎉'))