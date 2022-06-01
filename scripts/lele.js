const { rm, cp, mkdir, exec, env, which, exit } = require('shelljs')
const chalk = require('chalk')

const log = console.log

// 检查控制台是否可以运行'git'开头的命令
if (!which('git')) {
    // 在控制台输出内容
    log(chalk.red('Sorry, this script requires git'))
    exit(1)
}

// 获取产品配置信息
const fetchProductConfig = () => {
    return `
        curl 'http://cimcube-gtw-dev.dgct.glodon.com/bcp-common/dict/batch'
    `
}

exec(fetchProductConfig(), { silent: true }, (code, stdout) => {
    if (code === 0) {
        // log('result: ', stdout)
    } else {
        log('获取产品配置信息接口报错, 请确认接口正常')
        exit(1)
    }
})

