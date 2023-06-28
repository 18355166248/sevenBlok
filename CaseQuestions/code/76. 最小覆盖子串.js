// 给你一个字符串 s 、一个字符串 t 。返回 s 中涵盖 t 所有字符的最小子串。如果 s 中不存在涵盖 t 所有字符的子串，则返回空字符串 "" 。

// 注意：
// 对于 t 中重复字符，我们寻找的子字符串中该字符数量必须不少于 t 中该字符数量。
// 如果 s 中存在这样的子串，我们保证它是唯一的答案。

// 示例 1：
// 输入：s = "ADOBECODEBANC", t = "ABC"
// 输出："BANC"
// 解释：最小覆盖子串 "BANC" 包含来自字符串 t 的 'A'、'B' 和 'C'。
// 示例 2：
// 输入：s = "a", t = "a"
// 输出："a"
// 解释：整个字符串 s 是最小覆盖子串。
// 示例 3:
// 输入: s = "a", t = "aa"
// 输出: ""
// 解释: t 中两个字符 'a' 均应包含在 s 的子串中，
// 因此没有符合条件的子字符串，返回空字符串。

// 思路
// 使用双指针滑动窗口, 再用 map缓存每个字符存在的数量
// 通过 map.size 记录大小
// 先滚动右指针, 如果存在就将缓存中的字符数量-1, 假如到0, 就将size--
// 一直到size=0 表示所有的字符都已存在, 记录当前字符串 左指针到右指针
// 再移动左指针, 假如说存在, 就将缓存字符数量+1, 判断当前还是否满足包含字符串的条件(也就是判断 字符数量是否为1) 如果不满足, 将对比当前字符串和最小字符串, 进行更新

/**
 * @param {string} s
 * @param {string} t
 * @return {string}
 */
var minWindow = function(s, t) {
  if (s.length < t.length) return "";

  const map = new Map();
  let min = "";
  let nowStr = "";

  for (let i = 0; i < t.length; i++) {
    map.set(t[i], (map.get(t[i]) || 0) + 1);
  }
  let size = map.size;

  let l = 0;
  let r = 0;

  for (; r < s.length; r++) {
    if (map.has(s[r])) map.set(s[r], map.get(s[r]) - 1);
    if (map.get(s[r]) === 0) size--;

    while (!size) {
      nowStr = s.substring(l, r + 1);
      console.log(nowStr);

      if (map.has(s[l])) {
        map.set(s[l], map.get(s[l]) + 1);

        if (map.get(s[l]) === 1) {
          size++; // 当为1的时候表示当前字符串满足了子串
          // 表示是最小满足子串的字符串
          if (!min || min.length > nowStr.length) min = nowStr;
        }
      }

      l++;
    }
  }

  return min || "";
};

console.log(minWindow("ADOBECODEBANC", "ABC"));
// console.log(minWindow("aa", "aa"));
// console.log(minWindow("a", "aa"));
// console.log(minWindow("a", "a"));
// console.log(minWindow("bba", "ab"));
