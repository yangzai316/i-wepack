#### 基本概念
> 静态 模块 打包 工具

#### 依赖包
1. @babel/parser 将代码处理为 ast；
2. @babel/core 、@babel/preset-env 将ast处理为普通代码；
3. @babel/traverse 处理了ast数据；

#### 单入口，js依赖处理打包流程
1. 获取 congfig 中配置的入口路径 entry;
2. 将 entry 交给模块 fs 获取文件内容 content;
3. 将内容 content 交给 @babel/parser 模块 处理得到 ast 数据；
4. 从ast数据中分析，该文件所依赖的文件路径，存于字段 dependencies 中；
5. 将该文件的 ast 数据转换为普通 js 代码，存于字段 code 中；
6. 返回数据组合数据{entry,dependencies,code};
7. 将入口文件组合数据，存于 modules 中，并递归（重复2，3，4，5，6）处理组合数据中的dependencies，最终得到数据（所有依赖汇集于modules中）
8. 将modules处理为 key-value形式 modulesObj，并于后面处理
9. 获取config配置中的出口路径
10. 通过字符串方式，导出最后代码；

#### 最终导出代码内容分析
自执行匿名函数中，将modulesObj拼接进去，实现通过 key 找 value 的函数 require^ ,在 step5中所有通过 import 引入依赖的方式都会被babel转化为 require引入形式，通过 eval() 执行代码，上面实现的 require^ 就可以返回依赖内容的code内容进行拼接，从而得到最终执行的代码，就可以在浏览器中执行。

#### 补充
上面提到的require^函数，在实际的webpack打包中叫[__webpack_require__]；存放文件代码内容的map对象modules，在实际的webpack打包中叫[webpackJson]