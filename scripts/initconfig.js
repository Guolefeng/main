const { exec, which, exit, cd, touch } = require('shelljs')
const chalk = require('chalk')
const co = require('co')
const prompt = require('co-prompt')

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

// 获取产品配置信息
const fetchProductConfig = (productCode) => {
    return `
        curl 'http://cimcube-gtw-dev.dgct.glodon.com/bcp-common/dict/batch'
    `
}

co(function*() {
    const productCode = yield prompt('please input product code and then click Enter: ')
    exec(fetchProductConfig(productCode), { silent: true }, (code, stdout) => {
        if (code === 0) {
            // log('result: ', stdout)
            const product = {
                code: 'xxx',
                name: 'xxx',
                menus: [],
                components: [{
                    git: 'https://github.com/Guolefeng/sub1.git',
                    branch: 'dev',
                }, {
                    git: '',
                    branch: '',
                }, {
                    git: 'https://github.com/Guolefeng/sub2.git',
                    branch: 'feature',
                },{
                    git: 'https://github.com/Guolefeng/sub3.git',
                    branch: 'master',
                }]
            }
            cd('src')

            log(chalk.green('将产品配置信息写入配置文件: '))
            touch('productConfig.json')
            exec(`echo '${JSON.stringify(product)}' >> productConfig.json`)
            log(chalk.green('写入配置文件成功!'))

            log(chalk.green('为产品添加组件Git子模块:'))
            product.components.forEach((e) => {
                if (!e.git) {
                    return
                }

                if (exec(`git submodule add ${e.branch && e.branch !== 'master' ? `-b ${e.branch}` : ''} ${e.git}`).code !== 0) {
                    logErrorAndExit(`Error: Git submodule add ${e.git} failed`)
                }
            })
            cd ('..')
            // 添加子模块后，默认子模块目录下无任何内容。需要在项目根目录执行如下命令完成子模块的下载
            if (exec('git submodule update --init --recursive').code !== 0) {
                logErrorAndExit(`Error: Git submodule init and update failed`)
            }
            log(chalk.green('添加组件Git子模块成功'))

            log(chalk.green('将目前修改push到主仓库'))
            if (exec('git add .').code !== 0) {
                logErrorAndExit('Error: Git add failed')
            }
            if (exec('git commit -am "add submodule"').code !== 0) {
                logErrorAndExit('Error: Git commit failed')
            }
            if (exec('git push').code !== 0) {
                logErrorAndExit('Error: Git push failed')
            }
            log(chalk.green('push到主仓库成功'))

            log(chalk.green('🎉🎉🎉初始化产品配置信息成功!🎉🎉🎉'))

            process.exit()
        } else {
            logErrorAndExit('Error: 获取产品配置信息接口报错, 请确认接口正常')
        }
    })
})