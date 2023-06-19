# Service Worker

> 借鉴文档

- [service-worker 的踩坑实践](https://juejin.cn/post/6844903919487811598)

> MDN

- [Cache](https://developer.mozilla.org/zh-CN/docs/Web/API/Cache)
- [ServiceWorker](https://developer.mozilla.org/zh-CN/docs/Web/API/ServiceWorker)

### 实施

在项目初始化的时候加载 注册事件

// src/service-worker/index.ts

```js
function emitUpdate() {
  // eslint-disable-next-line no-alert
  if (window.confirm("页面有更新 请确认!") === true) {
    try {
      navigator.serviceWorker.getRegistration().then((reg: any) => {
        // console.log('通知 sw 更新');
        reg.waiting.postMessage("skipWaiting");
      });
    } catch (e) {
      window.location.reload();
    }
  }
}

const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        "/load-dll-sw.js",
        {
          scope: "/",
        }
      );

      if (registration.waiting) {
        emitUpdate();
        return;
      }

      if (registration.installing) {
        console.log("正在安装 Service worker");
      } else if (registration.waiting) {
        console.log("已安装 Service worker installed");
      } else if (registration.active) {
        console.log("激活 Service worker");
      }

      // 避免无限刷新
      registration.onupdatefound = function() {
        const installingWorker = registration.installing;

        if (installingWorker) {
          installingWorker.onstatechange = function() {
            // eslint-disable-next-line default-case, @typescript-eslint/switch-exhaustiveness-check
            switch (installingWorker.state) {
              case "installed":
                if (navigator.serviceWorker.controller) {
                  // 更新
                  emitUpdate();
                }
                break;
            }
          };
        }
      };
    } catch (error) {
      console.error(`注册失败：${error}`);
    }
  }
};

registerServiceWorker();

export {};
```

在 index.html 同级新建文件 public/load-dll-sw.js

```js
const SW_VERSION = "V1"; // 需要更新的时候手动改这里的版本号即可
const CACHE_FILE_TYPE = [
  "js",
  "css",
  "html",
  "jpg",
  "json",
  "png",
  "mp3",
  "wav",
  "mp4",
  "ttf",
];

// 需要确认缓存的文件
const CACHE_FILE_LIST = [
  "/dll/lodash.dll.js",
  "/dll/react.dll.js",
  "/dll/jquery.dll.js",
];
// 需要忽悠的文件列表
const IGNORE_FILE_LIST = [];
/**
 * 是否是对应的文件类型
 * @param {*} url
 */
function isAcceptFile(url) {
  // eslint-disable-next-line prefer-template
  const r = new RegExp("\\.(" + CACHE_FILE_TYPE.join("|") + ")$");
  return r.test(url);
}
/**
 * 检查文件名
 */
function checkIgnoreFileName(url) {
  const r = new RegExp(`(${IGNORE_FILE_LIST.join("|")})$`);
  return r.test(url);
}

// eslint-disable-next-line no-restricted-globals
self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(SW_VERSION).then(function(cache) {
      return cache.addAll(CACHE_FILE_LIST);
    })
  );
});
// eslint-disable-next-line no-restricted-globals
self.addEventListener("activate", function(event) {
  const cacheWhitelist = [SW_VERSION];
  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(
        keyList.map(function(key) {
          if (cacheWhitelist.indexOf(key) === -1) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});
// eslint-disable-next-line no-restricted-globals
self.addEventListener("fetch", function(event) {
  const { method, url } = event.request;
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response !== undefined) {
        return response;
      }
      return fetch(event.request)
        .then(function(response) {
          const responseClone = response.clone();
          if (method === "POST") {
            return response;
          }
          if (!isAcceptFile(url)) {
            return response;
          }
          if (checkIgnoreFileName(url)) {
            return response;
          }
          caches.open(SW_VERSION).then(function(cache) {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(function(error) {
          return Promise.reject(error);
        });
    })
  );
});

// eslint-disable-next-line no-restricted-globals
self.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") {
    console.log("更新sw2-");
    // eslint-disable-next-line no-restricted-globals
    self.skipWaiting();
  }
});
```
