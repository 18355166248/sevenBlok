// 给定一个按照升序排列的整数数组 nums，和一个目标值 target。找出给定目标值在数组中的开始位置和结束位置。
// 如果数组中不存在目标值 target，返回 [-1, -1]。
var searchRange = function(nums, target) {
  const i = binarySearch(nums, target);

  if (i === -1) return [-1, -1];
  else {
    let l = i,
      r = i + 1;
    while (nums[l] === target && l >= 0) l--;
    while (nums[r] === target && r < nums.length) r++;

    return [l + 1, r - 1];
  }
};

function binarySearch(
  nums,
  target,
  l = 0,
  r = nums.length - 1,
  m = (l + r) >>> 1
) {
  return l > r
    ? -1
    : nums[m] === target
    ? m
    : nums[m] > target
    ? binarySearch(nums, target, l, m - 1)
    : binarySearch(nums, target, m + 1, r);
}
console.log(searchRange([5, 7, 7, 8, 8, 10], 8));
console.log(searchRange([5, 7, 7, 8, 8, 10], 6));
console.log(searchRange([7, 7, 7, 7, 8, 9], 7));
console.log(searchRange([1], 1));
console.log(searchRange([2, 2], 2));
console.log(searchRange([1, 3], 1));
