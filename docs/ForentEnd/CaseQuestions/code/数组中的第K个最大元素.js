function quickSort(arr, targetIndex, start) {
  if (arr.length <= 1) return arr[0];
  let left = [];
  let right = [];
  const mid = Math.floor(arr.length / 2);
  const midNum = arr.splice(mid, 1)[0];

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > midNum) {
      right.push(arr[i]);
    } else {
      left.push(arr[i]);
    }
  }

  if (left.length + start === targetIndex) {
    return midNum;
  } else if (left.length + start > targetIndex) {
    return quickSort(left, targetIndex, start);
  } else {
    return quickSort(right, targetIndex, left.length + start + 1);
  }
}

var findKthLargest = function(nums, k) {
  const num = quickSort(nums, nums.length - k, 0);

  return num;
};

console.log(findKthLargest([3, 6, 5, 4, 10, 8, 7, 2, 1], 2));
