var findMin = function(nums) {
  if (nums.length === 1) return nums[0];

  nums = [...new Set(nums)];
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
console.log(findMin([2, 2, 2, 0, 1]));
console.log(findMin([1, 3, 5, 1]));
