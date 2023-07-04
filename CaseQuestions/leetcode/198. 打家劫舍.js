// 你是一个专业的小偷，计划偷窃沿街的房屋。每间房内都藏有一定的现金，影响你偷窃的唯一制约因素就是相邻的房屋装有相互连通的防盗系统，如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警。

// 给定一个代表每个房屋存放金额的非负整数数组，计算你 不触动警报装置的情况下 ，一夜之内能够偷窃到的最高金额。
/**
 * @param {number[]} nums
 * @return {number}
 */
var rob = function(nums) {
  if (nums.length === 1) return nums[0];
  let dp1 = 0;
  let dp2 = nums[0];

  for (let i = 2; i <= nums.length; i++) {
    // 比较往前2个的房屋可偷的金额和当前房屋的金额 和往前一个房屋可偷的金额谁最大
    const curDp = Math.max(dp1 + nums[i - 1], dp2);
    dp1 = dp2;
    dp2 = curDp;
  }

  return dp2;
};

console.log(rob([1, 2, 3, 1])); // 4
console.log(rob([2, 7, 9, 3, 1])); // 12
