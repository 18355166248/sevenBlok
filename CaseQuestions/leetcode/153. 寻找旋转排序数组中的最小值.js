var findMin = function(nums) {
  const length = nums.length;
  if (length === 1 || nums[0] < nums[length - 1]) return nums[0];

  const mid = Math.ceil(length / 2);

  for (let i = 1; i < mid; i++) {
    if (nums[i] < nums[i - 1]) {
      return nums[i];
    }
  }

  for (let i = mid; i < length; i++) {
    if (nums[i] < nums[i - 1]) {
      return nums[i];
    }
  }
};
console.log(findMin([3, 4, 5, 1, 2]));
console.log(findMin([4, 5, 6, 7, 0, 1, 2]));
console.log(findMin([11, 13, 15, 17]));
