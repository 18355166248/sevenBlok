// 给你一个字符串 s，找到 s 中最长的回文子串
// 示例 1：
// 输入：s = "babad"
// 输出："bab"
// 解释："aba" 同样是符合题意的答案。
// 示例 2：
// 输入：s = "cbbd"
// 输出："bb"

// 中心扩散的方式
// 两种情况
// 一种是回文字符串为单数
// 一种是回文字符串为双数
var longestPalindrome = function(s) {
  if (s.length < 2) return s;
  let str = "";

  // 中心扩散的方式, 两种情况, 一种是中心字符串为单数 一种是中心字符串为双数
  for (let i = 0; i < s.length; i++) {
    getMaxStr(i, i);
    getMaxStr(i, i + 1);
  }

  function getMaxStr(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      left--;
      right++;
    }

    if (right - left - 1 > str.length) {
      str = s.slice(left + 1, right);
    }
  }

  return str;
};

// const s = "cbbd";
const s = "babad";

console.log(longestPalindrome(s));
