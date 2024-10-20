/**
 * @param {number[]} nums
 * @return {number}
 */
var rob = function(nums) {
  const length = nums.length;
  if (length === 1) return nums[0];
  else if (length === 2) return Math.max(nums[0], nums[1]);

  return Math.max(abs(nums, 0, length - 2), abs(nums, 1, length - 1));
};

function abs(nums, start, end) {
  let one = nums[start],
    two = Math.max(one, nums[start + 1]);

  for (let i = start + 2; i <= end; i++) {
    const preTwo = two;
    two = Math.max(one + nums[i], two);
    one = preTwo;
  }

  return two;
}

console.log(rob([2, 3, 2])); // 3
console.log(rob([1, 2, 3, 1])); // 4
console.log(rob([1, 2, 3])); // 3
console.log(rob([1, 3, 1, 3, 100])); // 103
console.log(rob([2, 1, 1, 2])); // 3
console.log(rob([4, 1, 2, 7, 5, 3, 1])); // 14
