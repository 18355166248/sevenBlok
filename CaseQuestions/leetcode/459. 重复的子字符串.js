/*
 * @lc app=leetcode.cn id=459 lang=javascript
 *
 * [459] 重复的子字符串
 */

// @lc code=start
/**
 * @param {string} s
 * @return {boolean}
 */
// var repeatedSubstringPattern = function(s) {
//   if (s === 1) return true;

//   const midLength = Math.floor(s.length / 2);
//   let canRepeat = false;

//   dfs(s, s[0], 1);
//   return canRepeat;

//   /**
//    *
//    * @param {字符串} code
//    * @param {子串} str
//    * @param {循环子串的下一个开始索引} end
//    * @returns
//    */
//   function dfs(code, str, end) {
//     const length = str.length;
//     if (length > midLength) return; // 表示字符串超过 不可能存在重复
//     const next = code.substring(end, end + length);

//     if (next !== str) {
//       // 表示子串已经存在不同的 停止循环
//       const sonStr = code.substr(0, length + 1);
//       dfs(code, sonStr, length + 1);
//       return;
//     } else if (end + length === code.length) return (canRepeat = true); // 表示可重复
//     dfs(code, str, end + length);
//   }
// };

var repeatedSubstringPattern = function(s) {
  const length = s.length;

  for (let i = 1; i * 2 <= length; i++) {
    if (length % i === 0) {
      let match = true;
      for (let j = i; j < length; j++) {
        console.log(s.charAt(j), s.charAt(j - i), j, i, j - i);
        if (s.charAt(j) !== s.charAt(j - i)) {
          match = false;
          break;
        }
      }

      if (match) {
        return true;
      }
    }
  }

  return false;
};

console.log(repeatedSubstringPattern("ababab"));
// console.log(repeatedSubstringPattern("bbb"));
// console.log(repeatedSubstringPattern("babab"));
// console.log(repeatedSubstringPattern("abcabcabcabc"));
// console.log(repeatedSubstringPattern("abac"));
