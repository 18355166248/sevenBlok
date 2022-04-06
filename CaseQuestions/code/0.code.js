var searchInsert = function(nums, target) {
  if (target < nums[0]) return 0;
  let left = 0;
  while (left <= nums.length - 1) {
    if (nums[left] === target) {
      return left;
    } else if (nums[left] > target) {
      return left;
    }

    left++;
  }
  return left;
};

console.log(searchInsert([1, 3, 5, 6], 5)); // 2
console.log(searchInsert([1, 3, 5, 6], 2)); // 1
console.log(searchInsert([1, 3, 5, 6], 7)); // 4
console.log(searchInsert([1, 3, 5, 6], 0)); // 0
console.log(searchInsert([1], 1)); // 0
