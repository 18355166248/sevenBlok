// 给你一个整数数组 nums ，其中可能包含重复元素，请你返回该数组所有可能的子集（幂集）。
// 解集 不能 包含重复的子集。返回的解集中，子集可以按 任意顺序 排列。

// 示例 1：
// 输入：nums = [1,2,2]
// 输出：[[], [1], [1, 2], [1, 2, 2], [2], [2, 2]]

// 示例 2：
// 输入：nums = [0]
// 输出：[[],[0]]

/* 解法1: 迭代 */
var subsetsWithDup = function(nums) {
  const arr = [[]];
  let prePrevvLen = arr.length;

  for (let i = 0; i < nums.length; i++) {
    const resultArr = [];
    const length = arr.length; // 每次外层循环缓存上一次arr的长度, 用于复制数据

    for (let j = 0; j < length; j++) {
      // 这里是否添加数据是从上上次结果集的末尾开始遍历上次新加入的结果集, 将新元素一一加进去
      // 这里需要注意的是 加入当前值和上一个值是相同的那么上一个值的j值的for循环其实在当前j循环
      // 不应该再走一遍了 因为肯定重复了 所以需要规避掉
      if (j < prePrevvLen && nums[i] === nums[i - 1]) continue;
      resultArr.push(arr[j].concat([nums[i]]));
    }

    prePrevvLen = arr.length;
    console.log(i, arr);
    arr.push(...resultArr);
  }

  console.log(JSON.stringify(arr));
};

const arr = [1, 2, 2];
console.log(subsetsWithDup(arr));
