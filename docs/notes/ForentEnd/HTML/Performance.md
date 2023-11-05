# Performance

- [Performance](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance)
- [PerformanceNavigationTiming](https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceNavigationTiming)

## 指标定义

- 首屏时间（FP）：First Paint，从打开页面到首个像素渲染到页面的时长

- 首次内容绘制时间（FCP）：First Contentful Paint，首次绘制完成 DOM 内容的时长，内容包括文本、图片（包含背景图）、非白色的 canvas 或 SVG，也包括带有正在加载中的 Web 字体的文本

- 页面可交互时间（TTI）：Time to interactive，从页面加载开始到页面处于完全可交互状态的时长。

* 1 秒快开比：首屏完全加载时长 ≤1s 的 PV 占比 2 秒快开比：首屏完全加载时长 ≤2s 的 PV 占比 5 秒慢开比：首屏完全加载时长>5s 的 PV 占比

## FP (First Paint)

FP 是当浏览器开始绘制内容到屏幕上的时候，只要在视觉上开始发生变化，无论是什么内容触发的视觉变化，在这一刻，这个时间点，叫做 FP。
可通过 performance.getEntriesByType('paint') 方法获取， FP 和 FCP 就在其中。
找到 name 为 first-paint 的对象，描述的即为 FP 的指标数据，其中 startTime 即为 FP 时间。

## FCP (First Contentful Paint)

FCP 指的是浏览器首次绘制来自 DOM 的内容。例如：文本，图片，SVG，canvas 元素等，这个时间点叫 FCP。
可通过 performance.getEntriesByType('paint') 方法获取， FP 和 FCP 就在其中
找到 name 为 first-contentful-paint 的对象，描述的即为 FCP 的指标数据，其中 startTime 即为 FCP 时间。

## 采样 PV

PV \_ 页面性能采样率

## 快开比 DOM

解析完毕时长 ≤ 某时长(如 2s)的 采样 PV / 总采样 PV \_ 100%

## 慢开比 DOM

解析完毕时长 ≥ 某时长(如 5s)的 采样 PV / 总采样 PV \* 100%

## 首字节

计算方式：responseStart - fetchStart

## DOM Ready

HTML 加载完成时间，计算方式：domContentLoadedEventEnd - fetchStart

## 页面完全加载

页面完全加载时间，计算方式：loadEventStart - fetchStart

## DNS 查询

DNS 解析耗时，计算方式：domainLookupEnd - domainLookupStart

## TCP 连接

TCP 连接耗时，计算方式：connectEnd - connectStart

## 请求响应

Time to First Byte(TTFB)，计算方式：responseStart - requestStart

## 内容传输

数据传输耗时，计算方式，responseEnd - responseStart

## DOM 解析

DOM 解析耗时，计算方式：domInteractive - responseEnd

## 资源加载

资源加载耗时(页面中同步加载的资源)，loadEventStart - domContentLoadedEventEnd
