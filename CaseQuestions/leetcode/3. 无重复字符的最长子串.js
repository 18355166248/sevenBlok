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

// 无重复字符的最长子串
// 用双指针的方式往前前进, 不重复的就计算双指针的距离缓存最大值表示最长
// 遇到重复的就移动左指针到重复字符的右边 继续往前走
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring2 = function(s) {
  const map = new Map();
  let L = 0;
  let max = 0;

  for (let R = 0; R < s.length; R++) {
    // 左指针右移的前提不仅是要有重复的 且还是当前左右指针内的值 之前的值不行
    if (map.has(s[R]) && map.get(s[R]) >= L) {
      L = map.get(s[R]) + 1;
    }

    max = Math.max(max, R - L + 1);

    map.set(s[R], R);
  }

  return max;
};

console.log(lengthOfLongestSubstring("abcabcbb"));

var s = "abcabcbb";
console.log(lengthOfLongestSubstring(s));
// var s1 = "bbbbb";
// console.log(lengthOfLongestSubstring(s1));
// var s2 = "pwwkew";
// console.log(lengthOfLongestSubstring(s2));
// var s3 = "dvdf";
// console.log(lengthOfLongestSubstring(s3));
