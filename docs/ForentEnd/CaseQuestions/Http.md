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


## HTTP 报文包含内容

### 请求报文结构

+ 第一行是请求的url, 请求的方法还有协议版本
+ 接下来多行都是请求手部的Header, 每个首部都有首部的key值, 以及对应的值
+ 一个空行用来区分首部和内容主体body
+ 最后是请求的内容主体

```shell
GET http://www.example.com/ HTTP/1.1
Accept:text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8
Cache-Control: max-age=0
Host: www.example.com
If-Modified-Since: Thu, 17 Oct 2019 07:18:26 GMT
If-None-Match: "3147526947+gzip"
Proxy-Connection: keep-alive
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 xxx

param1=1&param2=2
```

### 请求的头部信息

+ Accept 浏览器能够处理的内容类型
+ Accept-Charset 浏览器能够显示的字符集
+ Accept-Encoding 浏览器处理的压缩编码
+ Accept-language 浏览器支持的语言
+ Connection 浏览器和服务器之间的链接类型
+ Cookie 当前页面设置的任何cookie
+ Host 发送请求页面所在的域
+ Referer 发送请求页面的url
+ User-Agent 浏览器的用户代理字符串

![](~@public/Casequestion/httpRequestHeader.png)


### 响应报文结构

+ 第一行包含协议版本, 请求的code码, 以及描述, 200表示请求成功了
+ 下面多行也是首部内容
+ 一个空行分割首部和内容主体
+ 最后是响应的内容主体

```shell
HTTP/1.1 200 OK
Age: 529651
Cache-Control: max-age=604800
Connection: keep-alive
Content-Encoding: gzip
Content-Length: 648
Content-Type: text/html; charset=UTF-8
Date: Mon, 02 Nov 2020 17:53:39 GMT
Etag: "3147526947+ident+gzip"
Expires: Mon, 09 Nov 2020 17:53:39 GMT
Keep-Alive: timeout=4
Last-Modified: Thu, 17 Oct 2019 07:18:26 GMT
Proxy-Connection: keep-alive
Server: ECS (sjc/16DF)
Vary: Accept-Encoding
X-Cache: HIT

<!doctype html>
<html>
<head>
    <title>Example Domain</title>
</body>
</html>
```

### 响应的头部信息

+ Age 推算资源创建经过时间
+ Cache-Control 控制http缓存 no-cache, no-store, must-revalidate max-age=2592000
+ Connection 浏览器和服务器之间的链接类型
+ Content-Encoding 适用的编码方式
+ Content-Type表示后面的文档属于什么MIME类型
+ Date 表示消息发送的时间
+ ETage 资源的匹配信息
+ Expires 提供一个日期时间, 响应在该日期时间后被认为失效 该时间是GMT 时间(格林威治)
+ Last-Modified 资源的最后日期修改时间
+ Server 服务器名字


## http缓存策略

+ Expires 告诉浏览器在该时间之前, 可以直接从缓存中获取, 而无需向服务器获取 注意是 GMT时间(格林威治)
+ Cache-Control 优先级高于Expires, 如果同时设置了Expires和Cache-Control, Expires会被忽略
  - no-cache 有缓存 但是不直接使用缓存, 需要经过校验
  - no-store 完全没有缓存 所有的请求都需要发送校验
+
