// 给你一个字符串 s 和一个字符规律 p，请你来实现一个支持 '.' 和 '*' 的正则表达式匹配。
// '.' 匹配任意单个字符
// '*' 匹配零个或多个前面的那一个元素
// 所谓匹配，是要涵盖 整个 字符串 s的，而不是部分字符串。

/**
 * @param {string} s
 * @param {string} p
 * @return {boolean}
 */
var isMatch = function(s, p) {
  const m = s.length;
  const n = p.length;

  // 生成一个dp 长宽基于 m+1 * n+1
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(false));
  dp[0][0] = true; // 0 0 表示空字符串 默认是匹配的

  for (let i = 0; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      // 一种情况就是可能是 *  这种情况复杂很多 0匹配的话是 dp[i][j - 2]  如果s[i] === p[j-1] 则 dp[i][j] = dp[i - 1][j]
      // 另外一种不是 * 就是判断 i-i j-i 是不是相等的 符合的话赋值给当前
      if (p.charAt(j - 1) === "*") {
        // 两种情况 一种是0匹配 一种是大于0匹配
        dp[i][j] = dp[i][j - 2];
        if (matches(s, p, i, j - 1)) {
          dp[i][j] = dp[i][j] || dp[i - 1][j];
        }
      } else {
        if (matches(s, p, i, j)) dp[i][j] = dp[i - 1][j - 1];
      }
    }
  }
  return dp[m][n] || false;
};

function matches(s, p, i, j) {
  if (i === 0) return false;
  if (p.charAt(j - 1) === ".") return true;
  return s.charAt(i - 1) === p.charAt(j - 1);
}

console.log(isMatch("aa", "a")); // false
console.log(isMatch("aa", "a*")); // true
console.log(isMatch("ab", ".*")); // true
console.log(isMatch("ab", "*")); // false
