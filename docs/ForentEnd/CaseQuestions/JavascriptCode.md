---
sidebar: auto
---

# JavascriptCode.md

## 以下代码输出什么，为什么？

```js
try {
  let a = 0
  ;(async function() {
      a += 1
      console.log('inner', a)
      throw new Error('123')
      // a()
  })()
  console.log('outer', a)
} catch(e) {
  console.warn('Error', e)
}
```
