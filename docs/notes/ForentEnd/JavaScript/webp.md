# Service Workers + webP

采用 Service Workers 让网站动态加载 WebP 图片

网站性能优化，对于图片的处理，使图片采用 webp 格式，可以大大降低图片 size，提高网站性能具有重要意义。但是 webp 格式有兼容问题，一般是判断浏览器是否支持 webp，才采用 webp 格式。其实，页面种使用动态使用 webp 格式图片有很多方案，今天主要介绍的是采用 Service Workers 方案，关于 Service Workers，主要是用 pwa 离线方案。本博客就采用 Service Workers 技术。

Service Workers 加载 webp 图片
每个图片加载请求可以通过 accept 获取是否支持 webp 格式，例如如下图

利用这一点，我们可以判断支持 webp 图片，就使用 webp 图片。我们需要注册一个 Service Worker。Service Worker 的一大特性就是，它们能够拦截网络请求，这样子，我们就能够完全控制响应内容。使用这个特性，我们能够监听 HTTP 头部，并决定如何做。

首先我们注册 service worker

```js
<script>
// Register the service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
    // Registration was successful
    console.log('ServiceWorker registration successful with scope: ', registration.scope);
}).catch(function(err) {
    // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
    });
}
</script>
```

在上面的代码中，我们做了一个简单的检查，判断浏览器是否支持 Service Worker，如果支持，注册并安装 Service Worker。这段代码代码最好的地方就是做了兼容处理，如果浏览器不支持 Service Workers，它们会自动回退并且用户不会注意到其中差别。

接下来，我们需要创建 Service Worker 文件‘service-worker.js‘，用于拦截正在传递到服务器的请求。

```js
"use strict";

// Listen to fetch events
self.addEventListener("fetch", function(event) {
  // Check if the image is a jpeg
  if (/\.jpg$|.png$/.test(event.request.url)) {
    // Inspect the accept header for WebP support
    var supportsWebp = false;
    if (event.request.headers.has("accept")) {
      supportsWebp = event.request.headers.get("accept").includes("webp");
    }

    // If we support WebP
    if (supportsWebp) {
      // Clone the request
      var req = event.request.clone();

      // Build the return URL
      var returnUrl = req.url.substr(0, req.url.lastIndexOf(".")) + ".webp";

      event.respondWith(
        fetch(returnUrl, {
          mode: "no-cors",
        })
      );
    }
  }
});
```

这样就可以通过 Service Workers 让网站动态加载 WebP 图片了。
