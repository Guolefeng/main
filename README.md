### 测试自动化脚本

* npm run initconfig (自动化初始化产品配置)

1. 为新产品创建一个新的分支
2. 调用后端接口获取产品配置信息(名称, logo, 菜单, 组件子模块等)
3. 将配置信息存储到src/productConfig.json文件中
4. 拉取每个组件的git地址对应分支作为submodule并初始化git子模块
5. 将本分支对应修改推送到远程

* npm run removeconfig (自动化移除npm run initconfig脚本对项目的目录和git模块的修改)

* npm run pull (自动化拉取主仓库对应分支代码和子仓库对应分支代码)

* npm run push (自动化将子仓库修改推送到对应远程分支以及将主仓库修改推送对应到远程分支)

### create-react-app 配置多页面应用

* 参考地址1：https://www.jianshu.com/p/9a4b336b1410
* 参考地址2：https://cloud.tencent.com/developer/article/1745785