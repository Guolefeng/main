const { exec, which, exit, cd, touch, test } = require('shelljs')
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

if (test('-e', '.gitmodules')) {
    logErrorAndExit('已经初始化完成了, 如要再次初始化请先执行: npm run removeconfig 来移除初始化配置')
}

// 根据版本id获取产品版本配置信息
const fetchProductConfig = (versionId) => {
    return `
        curl 'http://cimcube-gtw-dev.dgct.glodon.com/bcp-console/busi-productVersion/${versionId} '
    `
}

co(function*() {
    const versionId = yield prompt('please input product version id and then click Enter: ')
    exec(fetchProductConfig(versionId), { silent: true }, (code, stdout) => {
        if (code === 0) {
            log('result: ', stdout)
            exit(1)
            const product = {
                code: 'xxx',
                name: 'xxx',
                menus: [],
                components: [{
                    git: 'git@github.com:Guolefeng/sub1.git',
                    branch: 'dev',
                }, {
                    git: '',
                    branch: '',
                }, {
                    git: 'git@github.com:Guolefeng/sub2.git',
                    branch: 'feature',
                },{
                    git: 'git@github.com:Guolefeng/sub3.git',
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

            log(chalk.green('🎉🎉🎉 初始化产品配置信息成功! 🎉🎉🎉'))

            process.exit()
        } else {
            logErrorAndExit('Error: 获取产品配置信息接口报错, 请确认接口正常')
        }
    })
})