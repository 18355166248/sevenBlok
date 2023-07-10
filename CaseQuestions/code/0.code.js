/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function(s) {
  if (s.length < 2) return s;

  let str = "";

  // 从中间往两边移动 注意单数双数的长度的字符串
  for (let i = 0; i < s.length; i++) {
    getStr(i, i);
    getStr(i, i + 1);
  }

  function getStr(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      left--;
      right++;
    }

    if (right - left - 1 > str.length) {
      str = s.substring(left + 1, right); // 字符串不包含left和right
    }
  }

  return str;
};

console.log(longestPalindrome("babad")); // bab
console.log(longestPalindrome("cbbd")); // bb
