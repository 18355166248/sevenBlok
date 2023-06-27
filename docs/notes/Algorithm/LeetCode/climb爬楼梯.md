# climb爬楼梯

```js
const obj = {};
var climbStairs = function(n) {
  if (n <= 2) return n;

  let n1 = obj[n - 1];
  let n2 = obj[n - 2];

  if (!n1) {
    n1 = climbStairs(n - 1);
    obj[n - 1] = n1;
  }
  if (!n2) {
    n2 = climbStairs(n - 2);
    obj[n - 2] = n2;
  }

  return n1 + n2;
};

console.log(climbStairs(45));
```