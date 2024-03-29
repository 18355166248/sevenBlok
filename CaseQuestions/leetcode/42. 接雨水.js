// 给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。
// 教程 https://leetcode.cn/problems/trapping-rain-water/solution/xiang-xi-tong-su-de-si-lu-fen-xi-duo-jie-fa-by-w-8/
/**
 * @param {number[]} height
 * @return {number}
 */

// 按行求
var trap = function(height) {
  let total = 0;

  // 计算当前最大值
  const max = Math.max.apply(Math, height);
  // 循环每一层 累加雨水
  for (let h = 1; h <= max; h++) {
    mapHeight(height, h);
  }

  function mapHeight(list, height) {
    let temp = 0;
    let start = false; // 是否开始更新
    for (let i = 0; i < list.length; i++) {
      // 小于的话 ++
      if (list[i] < height) {
        if (i === 0 || !start) continue;
        temp++; // 不等于0 且标记开始 且值小于高度 就累加1
      } else {
        total += temp; // 大于等于高度 将之前的temp累加给总值 并清除temp
        temp = 0;
        start = true; // 遇到大于等于height的 标记开始更新 从下一个开始累加
      }
    }
  }
  return total;
};
// 按列求
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
// 动态规划
var trap = function(height) {
  let total = 0;
  // 左边每个索引对应的左侧最大值
  const maxLeftList = Array(height.length).fill(0);
  // 右边每个索引对应的最大值
  const maxRightList = Array(height.length).fill(0);
  for (let i = 1; i < height.length - 1; i++) {
    maxLeftList[i] = Math.max(maxLeftList[i - 1], height[i - 1]);
  }

  for (let i = height.length - 2; i >= 0; i--) {
    maxRightList[i] = Math.max(maxRightList[i + 1], height[i + 1]);
  }
  for (let i = 1; i < height.length - 1; i++) {
    const min = Math.min(maxLeftList[i], maxRightList[i]);
    if (height[i] < min) {
      total += min - height[i];
    }
  }
  return total;
};
// 双指针
var trap = function(height) {
  let total = 0;
  // 左边每个索引对应的左侧最大值
  let maxLeft = 0;
  // 右边每个索引对应的最大值
  let maxRight = 0;
  let left = 1;
  let right = height.length - 2;

  for (let i = 1; i < height.length - 1; i++) {
    if (height[left - 1] < height[right + 1]) {
      // 表示左指针更小, 从左往右
      // 取左侧的最大值
      maxLeft = Math.max(maxLeft, height[left - 1]);
      const min = maxLeft; // 左指针的最大值
      // 最大值如果比左指针还大 就表示可以蓄水
      if (min > height[left]) {
        total += min - height[left];
      }
      // 前进是因为双指针要往中间聚拢
      left++;
    } else {
      // 表示右指针更小, 从右往左
      // 取右侧的最大值
      maxRight = Math.max(maxRight, height[right + 1]);
      const min = maxRight; // 右指针的最大值
      // 最大值如果比右指针还大 就表示可以蓄水
      if (min > height[right]) {
        total += min - height[right];
      }
      // 前进是因为双指针要往中间聚拢
      right--;
    }
  }
  return total;
};
// 栈
var trap = function(height) {
  let total = 0;
  const stack = [];
  let current = 0;

  while (current < height.length) {
    // 当栈不空的情况 当前值大于栈顶的值 就计算差值
    while (stack.length && height[current] > stack[0].h) {
      const { h } = stack.shift(); // 出栈
      if (!stack.length) break; // 栈空就出去
      const { h: newH, index } = stack[0]; // 出栈后的栈顶值
      // 计算两堵墙之间的距离
      const distance = current - index - 1;
      // 对比两堵墙的最小值
      const min = Math.min(height[current], newH);
      total += distance * (min - h);
    }

    stack.unshift({ index: current, h: height[current] }); // 入栈 指针右移
    current++;
  }

  return total;
};
console.log(trap([4, 2, 0, 3])); // 4
console.log(trap([0, 1, 0, 2, 1, 3])); // 2
console.log(trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1])); // 6
console.log(trap([4, 2, 0, 3, 2, 5])); // 9
console.log(trap([5, 2, 0, 3, 2, 4])); // 9
