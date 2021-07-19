# flat拍平数组

```js
 ```const arr = [
  1,
  2,
  3,
  4,
  [1, 2, 3, [1, 2, 3, [1, 2, 3]]],
  5,
  "string",
  { name: "弹铁蛋同学" },
];

function flat(arr) {
  return arr.reduce(
    (totalArr, item) =>
      totalArr.concat(Array.isArray(item) ? flat(item) : item),
    []
  );
}

console.log(flat(arr));
