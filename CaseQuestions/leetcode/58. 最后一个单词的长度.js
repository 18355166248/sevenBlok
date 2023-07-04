// 给你一个字符串 s，由若干单词组成，单词之间用空格隔开。返回字符串中最后一个单词的长度。如果不存在最后一个单词，请返回 0 。
// 单词 是指仅由字母组成、不包含任何空格字符的最大子字符串。
var lengthOfLastWord = function(s) {
  const res = s.match(/\b\w+\b/g) || [];
  return res[res.length - 1] ? res[res.length - 1].length : 0;
};
console.log(lengthOfLastWord("Hello World ")); // 5
console.log(lengthOfLastWord(" ")); // 5
