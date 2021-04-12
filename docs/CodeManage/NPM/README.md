# NPM日常操作

## 更新依赖

```shell
npm audit // 查看有哪些版本过低, 哪些版本过高
npm audit fix --force
npm install
```

## 更新版本号

```shell
npm version info
npm version patch
npm versipn prepatch
```

### 注意点

1. 不要在package.json的scripts下面写publish version什么的npm命令, 会造成命令行执行npm publish的时候默认再执行scripts下的命令一次, 出现2次执行的情况
