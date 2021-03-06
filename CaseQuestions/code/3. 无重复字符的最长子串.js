// 给定一个字符串，请你找出其中不含有重复字符的 最长子串 的长度。
var lengthOfLongestSubstring = function(s) {
  // 滚动的方式处理, 用哈希集合的方式判断是否重复
  const set = new Set(),
    len = s.length;
  let right = 0,
    max = 0;

  for (let i = 0; i < len; i++) {
    if (i !== 0) set.delete(s.charAt(i - 1));
    while (right < len && !set.has(s.charAt(right))) {
      set.add(s.charAt(right));
      right++;
    }

    max = Math.max(max, right - i);
  }

  return max;
};

var s = "abcabcbb";
console.log(lengthOfLongestSubstring(s));
// var s1 = "bbbbb";
// console.log(lengthOfLongestSubstring(s1));
// var s2 = "pwwkew";
// console.log(lengthOfLongestSubstring(s2));
// var s3 = "dvdf";
// console.log(lengthOfLongestSubstring(s3));
