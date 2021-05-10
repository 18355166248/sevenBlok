var maxArea = function(height) {
  let left = 0,
    right = height.length - 1,
    max = 0;

  while (left < right) {
    max = Math.max(max, (right - left) * Math.min(height[left], height[right]));
    if (height[left] > height[right]) right--;
    else left++;
  }

  return max;
};

console.log(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]));
console.log(maxArea([4, 3, 2, 1, 4]));
console.log(maxArea([1, 2, 1]));

// 使用双指针的方案, 求出每次双指针之间的最大值, 然后比较如果双指针的最小值, 如果左边偏小, 左侧向前进一位, 如果右侧偏小, 右侧向后退一位
