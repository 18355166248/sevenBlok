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
  + no-cache 有缓存 但是不直接使用缓存, 需要经过校验
  + no-store 完全没有缓存 所有的请求都需要发送校验


## http缓存详解

### 缓存相关header

#### 1. Expires

> 响应头, 代表该资源的过期时间

服务器告诉浏览器资源失效时间

缺点: 缓存过期以后, 不管资源是否改变都会再次去获取资源返回给浏览器

参数很多, 比如max-age

<!-- 缺点: 如果同一秒多次请求的话, 会一直去获取新的资源 -->

#### 2. Last-Modified && If-Modified-Since

> Last-Modified 响应头, 资源最近修改时间, 服务器告诉浏览器
> If-Modified-Since 请求头, 资源最近修改时间, 浏览器告诉服务器吗就是将Last-Modified传给服务器

为了解决Expires的缺点, 服务器会在响应头带上Last-Modified给浏览器, 当缓存过期以后, 浏览器会将Last-Modified的值同归If-Modified-Since字段放在请求头带给服务器, 如果字段没有改变, 返回304告诉浏览器继续使用缓存, 如果字段改变了, 服务器会生成新的Expires和Last-Modified带给浏览器, 如此往复

缺点:

1. Expires过期不稳定, 服务器可以随意更改
2. 过期时间只能精确到秒, 这里存在问题, 有个资源1.js, 当一秒内多次请求的话, 如果在这一秒内, 资源已经改变了很多次了, 那么缓存策略在第二次请求的时候发现最后修改时间没有变化, 就会认为文件没有改变, 这样的话, 浏览器就会收到304, 但是1.js已经修改了, 这样的话拿到的就不准确了
3. 如果服务器上的1.js被修改了, 但是内容其实没有变化, 这个时候回因为Last-Modified变化而重新获取资源发送给浏览器

#### 3. Etag && If-None-Match

> Etag 响应头 服务器发送给浏览器 他是资源的唯一Id标识 告诉浏览器资源是否改变
> If-None-Match 请求头 将ETag从浏览器发送给服务器, 服务器判断是否改变, 如果没有改变就返回304, 否则就获取新的资源返回给浏览器, 并附带新的Etag

单独用Last-Modified(最后修改时间)判断有缺陷, 假如文件修改了, 但是文件内容没变, 对于这种请求, 我们可以使用Etag来处理.

#### 2. Cache-Control

> 请求/响应头 缓存控制字段 精确控制缓存字段

属于新的缓存方案, 权重比Expires搞, 精细化也高很多
详情可以看![MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Cache-Control)

指令:
public 可以被任何对象缓存
private 只能被单个用户缓存, 不能被代理服务器缓存
no-cache 可以缓存, 但每次都要向服务器发送验证请求(协商缓存)
no-store 不适用任何缓存


### http缓存模拟场景

1. 浏览器请求1.js
2. 服务器返回1.js, 同时告诉浏览器Expires(绝对过期时间), 以及Cache-Control: publish max-age=10(相对过期时间), 以及1.js的最后修改时间Last-Modified和文件标识Etag
3. 10s内再次请求1.js, 浏览器不发送请求, 直接使用本地缓存
4. 11s时, 请求1.js, 带上最后修改时间If-Modified-Since(Last-Modified), 以及If-None-Match(Etag)
5. 服务器收到浏览器的If-Modified-Since和If-None-Match, 则比较If-None-Match和服务端的Etag的值, 忽略掉If-Modified-Since
6. 1.js没有变化, 则服务器返回304
7. 如此往复

### 最后

给资源加载后缀或者使用webpack打包的时候使用hash值命名也可以起到缓存的作用


## 三次握手和四次挥手

第一次握手：建立连接时，客户端发送syn包（syn=x）到服务器，并进入SYN_SENT状态，等待服务器确认；SYN：同步序列编号（Synchronize Sequence Numbers）。

第二次握手：服务器收到syn包，必须确认客户的SYN（ack=x+1），同时自己也发送一个SYN包（syn=y），即SYN+ACK包，此时服务器进入SYN_RECV状态；

第三次握手：客户端收到服务器的SYN+ACK包，向服务器发送确认包ACK(ack=y+1），此包发送完毕，客户端和服务器进入ESTABLISHED（TCP连接成功）状态，完成三次握手。

1）客户端进程发出连接释放报文，并且停止发送数据。释放数据报文首部，FIN=1，其序列号为seq=u（等于前面已经传送过来的数据的最后一个字节的序号加1），此时，客户端进入FIN-WAIT-1（终止等待1）状态。 TCP规定，FIN报文段即使不携带数据，也要消耗一个序号。
2）服务器收到连接释放报文，发出确认报文，ACK=1，ack=u+1，并且带上自己的序列号seq=v，此时，服务端就进入了CLOSE-WAIT（关闭等待）状态。TCP服务器通知高层的应用进程，客户端向服务器的方向就释放了，这时候处于半关闭状态，即客户端已经没有数据要发送了，但是服务器若发送数据，客户端依然要接受。这个状态还要持续一段时间，也就是整个CLOSE-WAIT状态持续的时间。
3）客户端收到服务器的确认请求后，此时，客户端就进入FIN-WAIT-2（终止等待2）状态，等待服务器发送连接释放报文（在这之前还需要接受服务器发送的最后的数据）。
4）服务器将最后的数据发送完毕后，就向客户端发送连接释放报文，FIN=1，ack=u+1，由于在半关闭状态，服务器很可能又发送了一些数据，假定此时的序列号为seq=w，此时，服务器就进入了LAST-ACK（最后确认）状态，等待客户端的确认。
5）客户端收到服务器的连接释放报文后，必须发出确认，ACK=1，ack=w+1，而自己的序列号是seq=u+1，此时，客户端就进入了TIME-WAIT（时间等待）状态。注意此时TCP连接还没有释放，必须经过2∗∗MSL（最长报文段寿命）的时间后，当客户端撤销相应的TCB后，才进入CLOSED状态。
6）服务器只要收到了客户端发出的确认，立即进入CLOSED状态。同样，撤销TCB后，就结束了这次的TCP连接。可以看到，服务器结束TCP连接的时间要比客户端早一些。

常见面试题
【问题1】为什么连接的时候是三次握手，关闭的时候却是四次握手？

答：因为当Server端收到Client端的SYN连接请求报文后，可以直接发送SYN+ACK报文。其中ACK报文是用来应答的，SYN报文是用来同步的。但是关闭连接时，当Server端收到FIN报文时，很可能并不会立即关闭SOCKET，所以只能先回复一个ACK报文，告诉Client端，"你发的FIN报文我收到了"。只有等到我Server端所有的报文都发送完了，我才能发送FIN报文，因此不能一起发送。故需要四步握手。

【问题2】为什么TIME_WAIT状态需要经过2MSL(最大报文段生存时间)才能返回到CLOSE状态？

答：虽然按道理，四个报文都发送完毕，我们可以直接进入CLOSE状态了，但是我们必须假象网络是不可靠的，有可以最后一个ACK丢失。所以TIME_WAIT状态就是用来重发可能丢失的ACK报文。在Client发送出最后的ACK回复，但该ACK可能丢失。Server如果没有收到ACK，将不断重复发送FIN片段。所以Client不能立即关闭，它必须确认Server接收到了该ACK。Client会在发送出ACK之后进入到TIME_WAIT状态。Client会设置一个计时器，等待2MSL的时间。如果在该时间内再次收到FIN，那么Client会重发ACK并再次等待2MSL。所谓的2MSL是两倍的MSL(Maximum Segment Lifetime)。MSL指一个片段在网络中最大的存活时间，2MSL就是一个发送和一个回复所需的最大时间。如果直到2MSL，Client都没有再次收到FIN，那么Client推断ACK已经被成功接收，则结束TCP连接。

【问题3】为什么不能用两次握手进行连接？

答：3次握手完成两个重要的功能，既要双方做好发送数据的准备工作(双方都知道彼此已准备好)，也要允许双方就初始序列号进行协商，这个序列号在握手过程中被发送和确认。

       现在把三次握手改成仅需要两次握手，死锁是可能发生的。作为例子，考虑计算机S和C之间的通信，假定C给S发送一个连接请求分组，S收到了这个分组，并发 送了确认应答分组。按照两次握手的协定，S认为连接已经成功地建立了，可以开始发送数据分组。可是，C在S的应答分组在传输中被丢失的情况下，将不知道S 是否已准备好，不知道S建立什么样的序列号，C甚至怀疑S是否收到自己的连接请求分组。在这种情况下，C认为连接还未建立成功，将忽略S发来的任何数据分 组，只等待连接确认应答分组。而S在发出的分组超时后，重复发送同样的分组。这样就形成了死锁。

【问题4】如果已经建立了连接，但是客户端突然出现故障了怎么办？

TCP还设有一个保活计时器，显然，客户端如果出现故障，服务器不能一直等下去，白白浪费资源。服务器每收到一次客户端的请求后都会重新复位这个计时器，时间通常是设置为2小时，若两小时还没有收到客户端的任何数据，服务器就会发送一个探测报文段，以后每隔75秒钟发送一次。若一连发送10个探测报文仍然没反应，服务器就认为客户端出了故障，接着就关闭连接。

