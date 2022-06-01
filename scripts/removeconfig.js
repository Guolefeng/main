const { exec, which, exit, cd, touch, grep } = require('shelljs')
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

// 需要先暂存 .gitmodules 文件, 否则会报错: fatal: please stage your changes to .gitmodules or stash them to proceed
exec('git add .')
exec('git commit -am "auto-commit before remove"')

const gitmodules = grep('-v', /submodule|url|branch/, ['.gitmodules'])
if (gitmodules.code === 0) {
    const submodulePaths = gitmodules.stdout.replace(/\s/g, '').split('path=')
    submodulePaths.unshift()
    // 逆初始化submodule
    if (exec(`git submodule deinit --all`).code !== 0) {
        logErrorAndExit('Error: git submodule deinit  failed')
    }
    submodulePaths.forEach((path) => {
        log(path)
        // 删除submodule
        if (exec(`git rm ${path}`).code !== 0) {
            logErrorAndExit('Error: Git rm failed')
        }
        if (exec(`git rm --cached ${path}`).code !== 0) {
            logErrorAndExit('Error: Git rm failed')
        }
        // 删除submodule目录
        if (exec(`rm -rf ${path}`).code !== 0) {
            logErrorAndExit('Error: rm -rf failed')
        }
        // 删除.git/modules对应的submodule目录
        if (exec(`rm -rf .git/modules/${path}`).code !== 0) {
            logErrorAndExit('Error: rm -rf failed')
        }
    })
    // 删除.gitmodules文件
    if (exec(`rm -rf .gitmodules`).code !== 0) {
        logErrorAndExit('Error: rm -rf failed')
    }

    // 删除产品配置文件
    if (exec(`rm -rf src/productConfig.json`).code !== 0) {
        logErrorAndExit('Error: rm -rf failed')
    }

    log(chalk.green('🎉🎉🎉remove config successful🎉🎉🎉'))
}