const arr = [1, [2, [3, [4]]], [5, 6], [7, 8], 9, [3, [3, [5, [8, [9], 99]]]]];

console.log(getDepth(arr));

function getDepth(arr) {
  let max = 0;
  get(arr);

  function get(arr, l = 1) {
    for (let i = 0; i < arr.length; i++) {
      if (Array.isArray(arr[i])) {
        max = Math.max(l + 1, max);
        get(arr[i], l + 1);
      }
    }
  }

  return max;
}
