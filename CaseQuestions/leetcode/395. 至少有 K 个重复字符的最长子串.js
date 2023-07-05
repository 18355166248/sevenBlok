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
  return dfs(s, k);
};

function dfs(w, k) {
  const map = new Map();
  for (let i = 0; i < w.length; i++) {
    map.set(w[i], (map.get(w[i]) || 0) + 1);
  }
  let split = "";
  for (const v of map) {
    if (v[1] < k) {
      split = v[0];
    }
  }

  if (!split) return w.length;
  let max = 0;

  const list = w.split(split);

  for (let i = 0; i < list.length; i++) {
    if (list[i]) {
      const len = dfs(list[i], k);
      max = Math.max(len, max);
    }
  }

  return max;
}

// console.log(longestSubstring("aaabb", 3)); // 3
// console.log(longestSubstring("ababbc", 2)); // 5
console.log(longestSubstring("weitong", 2)); // 0
