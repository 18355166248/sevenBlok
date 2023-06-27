# code

```js
// 34. 在排序数组中查找元素的第一个和最后一个位置

var searchRange = function(nums, target) {
  if (nums.length === 0) return [-1, -1];
  let left = 0,
    right = nums.length - 1;

  while (left <= right) {
    if (nums[left] !== target) {
      left++;
    }
    if (nums[right] !== target) {
      right--;
    }

    if (nums[left] === target && nums[left] === nums[right]) {
      return [left, right];
    }
  }

  return [-1, -1];
};

console.log(searchRange([5, 7, 7, 8, 8, 10], 8)); // [3, 4]
console.log(searchRange([5, 7, 7, 8, 8, 10], 6)); // [-1, -1]
console.log(searchRange([5], 5)); // [0, 0]
console.log(searchRange([1], 0)); // [-1,-1]
console.log(searchRange([2, 2], 1)); // [-1,-1]
```