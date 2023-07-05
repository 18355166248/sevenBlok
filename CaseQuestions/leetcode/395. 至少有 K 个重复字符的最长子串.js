// 给你一个字符串 s 和一个整数 k ，请你找出 s 中的最长子串， 要求该子串中的每一字符出现次数都不少于 k 。返回这一子串的长度。

// 输入：s = "aaabb", k = 3
// 输出：3
// 解释：最长子串为 "aaa" ，其中 'a' 重复了 3 次。
// 输入：s = "ababbc", k = 2
// 输出：5
// 解释：最长子串为 "ababb" ，其中 'a' 重复了 2 次， 'b' 重复了 3 次。
/**
 * @param {string} s
 * @param {number} k
 * @return {number}
 */
var longestSubstring = function(s, k) {
  const map = new Map();

  for (let r = 0; r < s.length; r++) {
    map.set(s[r], (map.get(s[r]) || 0) + 1);
  }

  map.forEach((v, key) => {
    if (v < k) map.delete(key);
  });
  // 边界条件, 假如说没有符合条件的数据直接返回0
  if (map.size === 0) return 0;

  let left = 0;
  const list = [];
  // 不在这个集合里面就是不符合规范的 基于不符合规范的字符对字符串进行切割
  for (let i = 0; i < s.length; i++) {
    if (!map.has(s[i]) && left !== i && i - left >= k) {
      list.push(s.substring(left, i));
      left = i + 1;
    }
  }
  console.log(list);
  return;

  const keys = [...map.keys()];

  let str;

  let l = 0;
  let start = false; // 表示是否已经确定滑动窗口的左侧索引
  for (let r = 0; r < s.length; r++) {
    if (map.has(s[r])) {
      if (!start) {
        l = r;
        start = true;
      }

      map.set(s[r], map.get(s[r]) - 1);
    }

    if (map.get(s[r]) === 0) map.delete(s[r]);

    // 表示已经确定完所有字符串 滚动结束
    if (map.size === 0) {
      str = s.substring(l, r + 1);
      break;
    }
  }

  console.log(str, keys);
  // if (map.size) return 0; // 还有数据没有清空 存在额外的数据 不满足条件
};

console.log(longestSubstring("aaabb", 3)); // 3
console.log(longestSubstring("ababbc", 2)); // 5
console.log(longestSubstring("q", 1)); // 1
console.log(longestSubstring("weitong", 2)); // 0
console.log(longestSubstring("ababacb", 3)); // 0
console.log(longestSubstring("bbaaacbd", 3)); // 3
