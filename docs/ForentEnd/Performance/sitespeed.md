# sitespeed 使用方法

## 安装

1. 推荐使用 docker 安装

```js
docker run --rm -v "$(pwd):/sitespeed.io" sitespeedio/sitespeed.io:15.9.0 https://www.sitespeed.io/
```

2. npm 安装

```js
npm install -g sitespeed.io

sitespeed.io https://www.sitespeed.io/
```

## 使用

1. 网站如果有登录功能, 需要设置执行的 js

> login.js

```js
module.exports = async function(context, commands) {
  // 登录地址
  await commands.navigate("https://power.medcloud.cn/portal/user/login");

  try {
    // 获取表单dom的id, 输入账号
    await commands.addText.byId("DENTAL", "memberCode");
    await commands.addText.byId("chenyx1", "username");
    await commands.addText.byId("chenyx1", "password");

    // Start the measurement and give it the alias login
    // The alias will be used when the metrics is sent to
    // Graphite/InfluxDB
    await commands.measure.start();

    // 找到提交按钮并单击它并等待 页面完成检查以完成下一个加载的URL
    await commands.click.byClassNameAndWait("ant-btn btnDental___ESne_");

    // 停止并收集指标
    return commands.measure.stop();
  } catch (e) {
    // We try/catch so we will catch if the the input fields can't be found
    // The error is automatically logged in Browsertime an rethrown here
    // We could have an alternative flow ...
    // else we can just let it cascade since it caught later on and reported in
    // the HTML
    throw e;
  }
};
```

> scriptjs

```js
module.exports = async function(context, commands) {
  // await commands.js.run('document.body.innerHTML = ""; document.body.style.backgroundColor = "white";');
  // await commands.measure.start('https://power.medcloud.cn/portal/home');
  await commands.js.run(
    'document.body.innerHTML = ""; document.body.style.backgroundColor = "white";'
  );
  await commands.measure.start(
    "https://power.medcloud.cn/portal/dpms_dental/appointment/appointment-view"
  );
  // return commands.measure.start('https://www.sitespeed.io')
};
```

2. 将上面 2 个 js 放在需要执行命令的目录下

```shell
docker run --rm -v "$(pwd):/sitespeed.io" sitespeedio/sitespeed.io:15.9.0 script.js --multi --preScript login.js --graphite.host=host.docker.internal
```

--graphite.host=host.docker.internal 表示使用劳动 sitespeed 的 Performance Dashboard[https://www.sitespeed.io/documentation/sitespeed.io/performance-dashboard/]功能

3. Performance Dashboard 使用

执行:

```shell
curl -O https://raw.githubusercontent.com/sitespeedio/sitespeed.io/main/docker/docker-compose.yml
```

> 如果安装不了, 请去系统 hosts 文件下添加 199.232.28.133 raw.githubusercontent.com 就可以正常安装了

再执行:

```shell
 docker-compose up -d (确保运行最新的Docker compose版本)
```

然后去 http://127.0.0.1:3000 访问就可以看到 Performance Dashboard 了

完成后，您可以通过运行 Docker compose stop&&Docker compose rm 关闭并删除所有 Docker 容器。将保留容器数据
