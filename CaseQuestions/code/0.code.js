// 459. 重复的子字符串
// 给定一个非空的字符串 s ，检查是否可以通过由它的一个子串重复多次构成。

/**
 * @param {string} s
 * @return {boolean}
 */
var repeatedSubstringPattern = function(s) {
  const length = s.length;

  for (let i = 1; i * 2 <= length; i++) {
    // 能整除才能保证可以重复多次
    if (length % i === 0) {
      let match = true;
      for (let j = i; j < length; j++) {
        if (s.charAt(j - i) !== s.charAt(j)) {
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

// console.log(repeatedSubstringPattern("abab")); // true
// console.log(repeatedSubstringPattern("bbbbb")); // true
// console.log(repeatedSubstringPattern("aba")); // false
console.log(repeatedSubstringPattern("abcabcabcabc")); // true
