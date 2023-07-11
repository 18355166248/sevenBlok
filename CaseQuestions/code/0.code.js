/**
 * @param {number[]} height
 * @return {number}
 */
var trap = function(height) {
  let total = 0;

  for (let i = 1; i < height.length - 1; i++) {
    // 找到左边的最大值
    let maxLeft = 0;
    for (let l = i - 1; l >= 0; l--) {
      if (height[l] > maxLeft) {
        maxLeft = height[l];
      }
    }

    // 找到右边的最大值
    let maxRight = 0;
    for (let r = i + 1; r < height.length; r++) {
      if (height[r] > maxRight) {
        maxRight = height[r];
      }
    }
    // 两边最高的墙中 最矮的那个 且大于当前墙 那差值就是可以塞的水
    const min = Math.min(maxLeft, maxRight);
    if (min > height[i]) {
      total += min - height[i];
    }
  }

  return total;
};

console.log(trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1])); // 6
