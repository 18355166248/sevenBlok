function getMax(arr, k) {
  const maxArr = [];
  for (let i = 0; i < arr.length - k + 1; i++) {
    const max = Math.max(...arr.slice(i, i + k));
    maxArr.push(max);
  }

  return maxArr;
}

const nums = [1, 3, -1, -3, 5, 3];

console.log(getMax(nums, 3));
