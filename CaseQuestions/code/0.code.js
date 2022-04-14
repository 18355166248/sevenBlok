var lengthOfLongestSubstring = function(s) {
  const length = s.length;
  if (length <= 1) return length;

  let max = 0;

  let curLen = 0;
  while (curLen < length) {
    max = Math.max(getlength(s, curLen), max);
    curLen++;
  }

  return max;
};

function getlength(s, start) {
  const map = new Map();
  let end = start;
  while (end < s.length) {
    if (map.get(s[end])) {
      return end - start;
    } else {
      map.set(s[end], 1);
      end++;
    }
  }

  return end - start;
}

console.log(lengthOfLongestSubstring("abcabcbb")); // 3
console.log(lengthOfLongestSubstring("bbbbb")); // 1
console.log(lengthOfLongestSubstring("pwwkew")); // 3
