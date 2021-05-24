var arr = [1, 2, 3, [1, 5, 6, [7, 9, [11, 32]]], 10, [4, [7, [8, [9, [10]]]]]];

function multiarr(arr) {
  const sArr = Array(arr.length).fill(0);

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    sArr[i]++;
    if (Array.isArray(arr[i])) {
      sArr[i] += item.length ? multiarr(item) : 1;
    }
  }

  return Math.max(...sArr);
}
console.log(multiarr(arr));
