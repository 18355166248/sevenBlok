# Cookie

## 本地端口通过谷歌插件设置 cookie 查询不到

2021-08-18 下午遇到了一个坑 钻研了半天找到了问题, 记录一下

大部分公司项目是依靠 cookie 做鉴权登录的. 当你在本地启动一个项目 localhost:8000 的时候, 可能会采用将测试环境的 cookie copy 过来进行本地项目登录

假如你是通过谷歌插件 使用 chorme.cookie.set 命令去设置本地 cookie 的时候, 是没有问题的

但是你去控制台 Application -> Cookies 下面是找不到你刚刚设置的 cookie 的.

更为诡异的是你查看你本地接口的请求头 你会发现请求头里面有这些 cookie

经过多次验证查找, 终于被我找到一部分原因了:

1. 虽然你设置的 localhost:3000 但是谷歌浏览器是不会管端口号的, 只会将 cookie 设置到 localhost 域名下

2. 想要看到你设置的 cookie 需要去 谷歌浏览器设置中查看, 地址: chrome://settings/siteData, 在这里你搜索 localhost 就可以看到你设置的 cookie 值了

3. 具体为啥看不到 cookie 其实是因为接口的 response.header 下的 set-cookie 里面的 Path 参数在作怪 这个 Path 限制了只能在 该 path 下才能获取到 cookie 所以你再 Applicaiton 下是看不到别的路径的 cookie 的
