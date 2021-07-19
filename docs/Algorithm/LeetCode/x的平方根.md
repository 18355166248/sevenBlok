# x的平方根

```js
 ```var mySqrt = function(x) {
  if (x < 2) return x;
  let left = 1,
    right = x;
  while (right - left > 1) {
    let mid = Math.floor((left + right) / 2);
    // 中间值的平方小于x的话, name代表最小值可以变成mid
    // 反之最大值可以变成mid
    if (mid * mid === x) return mid;
    if (mid * mid < x) {
      left = mid;
    } else {
      right = mid;
    }
  }

  return left;
};

console.log(mySqrt(8));
console.log(mySqrt(5));
console.log(mySqrt(4));
