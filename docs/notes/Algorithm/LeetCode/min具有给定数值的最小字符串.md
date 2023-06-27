# min具有给定数值的最小字符串

```js
function getSmallestString(n, k) {
  let ans = "";
  const charArr = [
    " ",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];

  for (let i = n; i >= 1; i--) {
    const bound = k - 26 * (i - 1);

    if (bound > 0) {
      ans += charArr[bound];
      k -= bound;
    } else {
      ans += "a";
      k -= 1;
    }
  }

  return ans;
}

console.log(getSmallestString(5, 73));
```