# Http知识点

## 1. http1.x和http2的区别

![Image from alias](~@public/Casequestion/httpHistory.png)

1. http2使用的是二进制传送, http1.X用的是文本(字符串)传送
2. http2支持多路复用
3. http2头部压缩 http2通过gzip和compress压缩头部再发送, 同时客户端和服务端会同时维护一张表, 所有字典都会记录在表中, 这样后面每次传输只需要传送表里面的索引id就行, 通过id从表中查询
4. http2支持在未经客户端许可的情况下, 主动向客户端推送内容

## 2. http和https的区别

1. https需要协议证书(需要钱)
2. http协议运行在TCP之上, 所有传输的内容都是明文, https运行在SSL/TLS之上, SSL/TLS运行在TCP之上, 所有传输的内容都是经过加密的
3. http是对称加密, https是用了非对称加密+对称加密的方式
4. https用的443端口, http用的是80端口

## http里面的code码

1. 2开头 (请求成功)

+ 200 成功 服务器已经成功处理了请求
+ 201 已创建 请求成功服务器创建了新的资源
+ 202 已接收 服务器已经接受请求, 但尚未处理
+ 203 非授权信息 服务器已经成功处理了请求, 但返回的信息可能来自另一个源
+ 204 无内容 服务器成功处理了请求, 但没有返回任何内容 表单提交只需要知道成功失败(提高性能)
+ 205 重置内容 服务器成功处理了请求, 但没有返回任何内容
+ 206 部分内容 服务器成功处理了部分请求 (一个范围下载)

2. 3开头 (请求被重定向) 表示要完成请求, 需要进一步操作

+ 300 (多种选择)
+ 301 (永久移动) 请求的网页已经永久移动到新位置
+ 302 (临时移动)
+ 303 (查看其他位置)
+ 304 (未修改)
+ 305 (使用代理)
+ 307 (临时重定向)

3. 4开头 (请求错误)

+ 400 (错误请求) 服务器不理解
+ 401 (未授权) 请求要求身份验证
+ 403 (禁止) 服务器拒绝请求
+ 404 (未找到) 服务器找到请求的网页
+ 405 (方法禁用) 禁止请求中指定的方法
+ 406 (不接受)
+ 407 (需要代替授权) 与401很像 不过要求请求者授权使用代理
+ 408 (请求超时)
+ 409 (冲突)
+ 410 (已删除)
+ 411 (需要有效长度)
+ 412 (未满足前提条件)
+ 413 (请求实体过大)
+ 414 (请求url过长)
+ 415 (不支持的媒体类型)
+ 416 (请求范围不符合要求)
+ 417 (为满足期望值)

4. 5开头 (服务器报错)

+ 500 (服务器内部错误)
+ 501 (尚未实施)
+ 502 (错误网关)
+ 503 (服务不可用) 通常只是暂时状态
+ 504 (网管超时)
+ 505 (http版本不受支持) 服务器不支持请求中所用的http版本

## nginx配置跨域的参数

```nginx
location / {
  add_header Access-Control-Allow-Origin *;
  add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
  add_header Access-Control-Allow-Headers 'DNT X-Mx-ReaToekn,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization'

  if ($request_method = 'OPTIONS') {
    return 204
  }
}
```

#### 说明

1. Access-Control-Allow-Origin: *
服务器默认不允许跨域.配置上面表示服务器可以接受所有的请求源

2. Access-Control-Allow-Headers 是为了防止出现以下错误：
Request header field Content-Type is not allowed by Access-Control-Allow-Headers in preflight response.

这个错误表示当前请求Content-Type的值不被支持。其实是我们发起了"application/json"的类型请求导致的。这里涉及到一个概念：预检请求（preflight request）,请看下面"预检请求"的介绍。

3. Access-Control-Allow-Methods 是为了防止出现以下错误：
Content-Type is not allowed by Access-Control-Allow-Headers in preflight response.

4. 给OPTIONS 添加 204的返回，是为了处理在发送POST请求时Nginx依然拒绝访问的错误
发送"预检请求"时，需要用到方法 OPTIONS ,所以服务器需要允许该方法。
