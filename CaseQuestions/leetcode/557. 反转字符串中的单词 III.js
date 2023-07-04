// 给定一个字符串 s ，你需要反转字符串中每个单词的字符顺序，同时仍保留空格和单词的初始顺序。
/**
 * @param {string} s
 * @return {string}
 */
var reverseWords = function(s) {
  const arr = s.split(" ");
  arr.forEach((str, i) => {
    arr[i] = reverseString(str);
  });
  return arr.join(" ");
};

var reverseString = function(s) {
  if (s.length === 1) return s;
  s = s.split("");
  let left = 0,
    right = s.length - 1;

  while (left < right) {
    [s[left], s[right]] = [s[right], s[left]];
    left++;
    right--;
  }

  return s.join("");
};

console.log(reverseWords("Let's take LeetCode contest")); // "s'teL ekat edoCteeL tsetnoc"
console.log(reverseWords("God Ding")); // "doG gniD"
