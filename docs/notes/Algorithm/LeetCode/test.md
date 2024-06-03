# test

```js
// 有一个 N 阶的台阶，每次可以走 1 阶、2 阶或者3阶，实现一个函数要求输入台阶数可以返回走到顶部的方法数
// 例：N 为 2 时候，有[2, 1-1]两种走法

// 要求 1：只允许使用递归

// 要求 2：当台阶数是 1000 时可以函数可以正常执行
function getNum(N) {
  const cache = new Map();

  function fn(n) {
    if (n <= 2) return n;
    if (cache.has(n)) {
      return cache.get(n);
    } else {
      const res = fn(n - 1);
      const res1 = fn(n - 2);
      const res2 = fn(n - 3);
      cache.set(n, res);
      return res + res1 + res2;
    }
  }
  return fn(N);
}

console.log(getNum(100));
```