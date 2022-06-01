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
if (exec('git add .').code !== 0) {
    logErrorAndExit('Error: Git add failed')
}

if (exec('git commit -am "auto-commit before remove"').code !== 0) {
    logErrorAndExit('Error: Git commit failed')
}

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
        // 删除submodule缓存
        if (exec(`git rm -rf ${path}`).code !== 0) {
            logErrorAndExit('Error: Git rm --cache failed')
        }
        // 删除submodule目录
        if (exec(`rm -rf --ignore-unmatch ${path}`).code !== 0) {
            logErrorAndExit('Error: rm -rf failed')
        }
        // 删除.git/modules对应的submodule目录
        if (exec(`rm -rf --ignore-unmatch .git/modules/${path}`).code !== 0) {
            logErrorAndExit('Error: rm -rf failed')
        }
    })
    // 删除.gitmodules文件
    if (exec(`rm -rf --ignore-unmatch .gitmodules`).code !== 0) {
        logErrorAndExit('Error: rm -rf failed')
    }

    // 删除产品配置文件
    if (exec(`rm -rf productConfig.json`).code !== 0) {
        logErrorAndExit('Error: rm -rf failed')
    }

    log(chalk.green('🎉🎉🎉remove config successful🎉🎉🎉'))
}