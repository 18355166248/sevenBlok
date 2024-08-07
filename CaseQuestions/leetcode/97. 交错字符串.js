// 给定三个字符串 s1、s2、s3，请你帮忙验证 s3 是否是由 s1 和 s2 交错 组成的。

// 两个字符串 s 和 t 交错 的定义与过程如下，其中每个字符串都会被分割成若干 非空 子字符串：

// s = s1 + s2 + ... + sn
// t = t1 + t2 + ... + tm
// |n - m| <= 1
// 交错 是 s1 + t1 + s2 + t2 + s3 + t3 + ... 或者 t1 + s1 + t2 + s2 + t3 + s3 + ...
// 提示：a + b 意味着字符串 a 和 b 连接。
var isInterleave = function(s1, s2, s3) {
  const m = s1.length,
    n = s2.length
  z = s3.length
  if (m + n !== z) return false
  if (z === 0 && n === 0 && m === 0) return true

  const dp = Array.from({ length: m + 1 }, (_) => Array(n + 1).fill(false))
  dp[0][0] = true

  for (let i = 0; i <= m; i++) {
    for (let j = 0; j <= n; j++) {
      const p = i + j - 1
      if (i > 0) {
        dp[i][j] = dp[i][j] || (dp[i - 1][j] && s1[i - 1] === s3[p])
      }
      if (j > 0) {
        dp[i][j] = dp[i][j] || (dp[i][j - 1] && s2[j - 1] === s3[p])
      }
    }
  }
  return dp[m][n]
}
console.log(isInterleave('aabcc', 'dbbca', 'aadbbcbcac'))
// console.log(isInterleave('aabcc', 'dbbca', 'aadbbbaccc'))
// console.log(isInterleave('', '', ''))
