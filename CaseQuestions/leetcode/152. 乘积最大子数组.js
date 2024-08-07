var maxProduct = function(nums) {
  if (nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];
  const length = nums.length;

  const maxF = [nums[0]];
  const minF = [nums[0]];

  for (let i = 1; i < length; i++) {
    maxF[i] = Math.max(
      maxF[i - 1] * nums[i],
      Math.max(nums[i], minF[i - 1] * nums[i])
    );
    minF[i] = Math.min(
      maxF[i - 1] * nums[i],
      Math.min(nums[i], minF[i - 1] * nums[i])
    );
  }

  return Math.max(...maxF);
};
console.log(maxProduct([2, 3, -2, 4]));
console.log(maxProduct([-2, 0, -1]));
