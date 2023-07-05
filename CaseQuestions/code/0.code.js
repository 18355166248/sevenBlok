/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
  const map = new Map();
  let l = 0;
  let max = 0;

  for (let r = 0; r < s.length; r++) {
    // 有值且在窗口内 就将左窗口移动到当前索引的右边
    if (map.has(s[r]) && map.get(s[r]) >= l) {
      l = map.get(s[r]) + 1;
    }
    map.set(s[r], r);

    max = Math.max(max, r - l + 1);
  }
  return max;
};
// 输入: s = "abcabcbb" 输出: 3
// 解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
console.log(lengthOfLongestSubstring("abcabcbb"));

// 输入: s = "bbbbb" 输出: 1
// 解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。
console.log(lengthOfLongestSubstring("bbbbb"));
// 输入: s = "pwwkew" 输出: 3
// 解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。
// 请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。
console.log(lengthOfLongestSubstring("pwwkew"));
