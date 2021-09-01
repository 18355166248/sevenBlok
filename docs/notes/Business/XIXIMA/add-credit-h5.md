# 充值的一些问题

## 登录鉴权

1. 跟后端协商好未登录的 <text-line>code</text-line> 码为 401, 如果未登录就跳转到登录页

```ts
function goLogin() {
  window.location.href = `${
    window.location.origin
  }/login?fromUri=${encodeURIComponent(window.location.href)}`;
}

if (data.code === 401) {
  goLogin();

  return Promise.reject(data);
}

if (data.code !== 200) {
  return Promise.reject(data);
}
return data;
```

2. 当你在用 <text-line>vconsole</text-line> 调试的时候, 可能看不到 token, 那是因为这个 token 被设置成了 httpOnly: true; 所以你看不到, 但是谷歌浏览器是可以看到的

3. 当你需要在 window 上声明一些变量的时候可以在 根目录的 .d.ts 文件中声明

```ts
declare global {
  interface Window {
    ALL_AXIOS_CANCEL: any[];
  }
}
```

4. 判断当期客户端环境

```ts
const os = importOS();

function importOS() {
  const userAgent = window.navigator.userAgent;
  const os: any = {};
  os.windowW = window.innerWidth;
  os.windowH = window.innerHeight;
  os.screenProp = os.windowW / os.windowH;
  os.userAgent = userAgent;
  os.android = !!(
    userAgent.match(/(Android)\s+([\d.]+)/) ||
    userAgent.match(/Silk-Accelerated/)
  );
  os.ipad = !!userAgent.match(/(iPad).*OS\s([\d_]+)/);
  os.iphone = !!(!os.ipad && userAgent.match(/(iPhone\sOS)\s([\d_]+)/));
  os.ios = os.ipad || os.iphone;
  os.wp = !!(userAgent.match(/Windows Phone/) || userAgent.match(/IEMobile/));
  os.weixin = !!userAgent.match(/MicroMessenger/);
  os.weibo = !!(userAgent.match(/Weibo/) || userAgent.match(/weibo/));
  os.douyin = !!userAgent.match(/ByteLocale/);
  os.ali = !!userAgent.match(/AliApp/);
  os.alipay = !!(os.ali && userAgent.match(/Alipay/));
  os.taobao = !!(os.ali && userAgent.match(/WindVane/));
  os.netease = !!userAgent.match(/NewsApp/);
  os.facebook = !!userAgent.match(/(FB)/);
  os.safari = !!(os.ios && userAgent.match(/Safari/));
  os.chrome = !!userAgent.match(/Chrome/);
  os.firefox = !!userAgent.match(/Firefox/);
  os.edge = !!userAgent.match(/Edge/);
  os.pc = !(os.android || os.ios || os.wp);
  os.innative = !!userAgent.match(/iting/i); // 判断是否是 App 内打开
  os.appIos = os.innative && os.ios; // 判断是否是 苹果 App
  os.appAndroid = os.innative && os.android; // 判断是否是 安卓 App

  return os;
}

export default os;
```

## 下单

1. 当获取后端返回的跳转的 <text-line>form 标签</text-line> 时, 可以如下操作

```ts
const divform: any = document.getElementsByTagName("divform");
if (divform.length) document.body.removeChild(divform[0]);
const div = document.createElement("divform");
div.innerHTML = res.data;
document.body.appendChild(div);
document.forms[0].submit();
```

## 其他知识点

1. axios 取消请求

```ts
import axios from "axios";

export const CancelToken = axios.CancelToken;

export async function axiosWithCancel(config: any) {
  return $axios({
    ...config,
    cancelToken: new CancelToken(function executor(c) {
      window.ALL_AXIOS_CANCEL.push(() => c(config.desc || ""));
    }),
  }).then((res: any) => {
    return Promise.resolve(res);
  });
}
```

<card-primary  type="warning">
<div>需要注意的是
如果你需要在 promise 的 catch 方法中捕获是否是取消请求的报错
可以使用 axios.Cancel 去判断</div>
</card-primary>

```ts
import axios from 'axios';

balabala.....
 .catch((err: any) => {
   if (err instanceof axios.Cancel) return;
 })
```

## 流程图

![](@public/business/credit.jpg)
