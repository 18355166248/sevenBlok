# Ajax 遇到的一些问题和解决方案

## 前端请求后端接口，返回的中文乱码都是？

#### 解决方案

```js
ajax({
  url: "xxxxxxx",
  headers: {
    //请求接口返回中文都是？，需要在请求头设置即可
    Accept: "application/json; charset=utf-8",
  },
  type: "post",
  dataType: "json",
});
```

## 服务端返回的 long 类型过长, 出现精度丢失

#### 背景

JavaScript 中的 Number 类型并不能完全表示 Long 类型的数字，当 Long 长度大于 17 位时会出现精度丢失的问题，浏览器会自动把超出部分用 0 表示。

Chrome 从第 17 位就开始作妖(有时候正常，有时候+1)，18 位以及后面均补 0

#### 解决方案

服务端给到前端是其实是 json 字符串 这个时候因为是字符串所以是不会出现丢失
这个时候可以使用 json-bigint 针对接口返回的字符串做处理, 将 long 类型转成 bigInt 或者字符串类型即可

```typescript
import JSONbig from "json-bigint";

const JSONbigString = JSONbig({ storeAsString: true });

export function getProductitems(data: any): Promise<CommonAxiosReponse> {
  return $axios.get(`${baseUrl}/productitem/search/`, {
    params: data,
    responseType: "text",
    transformResponse: [
      function(data) {
        // 对 data 进行任意转换处理
        return JSONbigString.parse(data);
      },
    ],
  });
}
```
