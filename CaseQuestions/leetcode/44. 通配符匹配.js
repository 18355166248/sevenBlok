// 给你一个输入字符串 (s) 和一个字符模式 (p) ，请你实现一个支持 '?' 和 '*' 匹配规则的通配符匹配：
// '?' 可以匹配任何单个字符。
// '*' 可以匹配任意字符序列（包括空字符序列）。
// 判定匹配成功的充要条件是：字符模式必须能够 完全匹配 输入字符串（而不是部分匹配）。

/**
 * @param {string} s
 * @param {string} p
 * @return {boolean}
 */
var isMatch = function(s, p) {
  const m = s.length;
  const n = p.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(false));
  dp[0][0] = true;
  // 这个循环就是为了判断 如果p一直是 * 号的情况 比如 s = '' p = "******"
  for (let i = 1; i <= n; i++) {
    if (p.charAt(i - 1) === "*") {
      dp[0][i] = true;
    } else {
      break;
    }
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (p.charAt(j - 1) === "*") {
        dp[i][j] = dp[i][j - 1] || dp[i - 1][j];
      } else if (s[i - 1] === p[j - 1] || p.charAt(j - 1) === "?") {
        dp[i][j] = dp[i - 1][j - 1];
      }
    }
  }
  return dp[m][n];
};

console.log(isMatch("aa", "a")); // false
console.log(isMatch("aa", "*")); // true
console.log(isMatch("cb", "?a")); // false
console.log(isMatch("aab", "c*a*b")); // false
