function solution(arr) {
  const length = arr.length;
  if (length === 0) return 0;
  if (length === 1) return arr[0];

  const dp = Array.from({ length: length + 1 }, () => [0, 0]);

  // 动态规划, 当前房间要么偷, 要么不偷 我们只考虑当前值和之前的值, 之后的不考虑
  // 如果偷的话 只有一种情况 左边的就不能偷
  // 如果不偷的话 有2种情况 左边的偷或者左边的不偷
  // 我们规定不偷为0的话, 偷就为1 我们数组长度为n, 所以我们就有n长度的数组, 每个索引下有2种情况, 一种为0的情况, 一种为1的情况

  for (let i = 1; i <= length; i++) {
    dp[i][0] = Math.max(dp[i - 1][0], dp[i - 1][1]);
    dp[i][1] = dp[i - 1][0] + arr[i - 1];
  }

  return Math.max(dp[length][0], dp[length][1]);
}

const a = [2, 7, 9, 3, 1];

console.log(solution(a));
