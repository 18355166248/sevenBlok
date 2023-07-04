var findPeakElement = function(nums) {
  if (nums.length === 1) return 0;
  if (nums.length === 2) return nums[0] > nums[1] ? 0 : 1;
  const length = nums.length;

  for (let i = 1; i < length; i++) {
    if (nums[i] > nums[i - 1] && nums[i] > nums[i + 1]) {
      return i;
    }
  }

  return nums[length - 1] > nums[0] ? length - 1 : 0;
};
console.log(findPeakElement([1, 2, 3, 1]));
console.log(findPeakElement([1, 2, 1, 3, 5, 6, 4]));
