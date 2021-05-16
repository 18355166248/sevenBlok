// 给定一个字符串 s 和一些长度相同的单词 words。找出 s 中恰好可以由 words 中所有单词串联形成的子串的起始位置。

// 注意子串要与 words 中的单词完全匹配，中间不能有其他字符，但不需要考虑 words 中单词串联的顺序。

var findSubstring = function(s, words) {
  const len = words[0].length
  const res = []
  // 循环, 循环的次数为字符串长度减去words所有字符串总和长度-1, 因为这个长度后面的字符串肯定不能拼接成words数组的数据
  for (let i = 0; i <= s.length - words.length * len; i++) {
    const wordsCopy = [...words]
    // 深度优先遍历
    dfs(wordsCopy, s.substring(i), i)
  }

  return res

  function dfs(arr, s, start) {
    // 递归的结束条件为数组的长度为0, 或者进不去下方的判断
    if (arr.length === 0) return res.push(start)

    // 从字符串开始剪切固定长度字符串, 去words中查找, 如果找不到, 结束, 如果找到了 继续往下查找
    const str = s.substr(0, len)

    const index = arr.findIndex((item) => item === str)

    if (index > -1) {
      // 递归查找之前需要将已经使用过的数组索引删除, 字符串也需要删除已经判断过的
      arr.splice(index, 1)
      dfs(arr, s.substring(len), start)
    }
  }
}

const s = 'barfoothefoobarman',
  words = ['foo', 'bar']

const s1 = 'wordgoodgoodgoodbestword',
  words1 = ['word', 'good', 'best', 'word']

const s2 = 'wordgoodgoodgoodbestword',
  words2 = ['word', 'good', 'best']

console.log(findSubstring(s, words))
console.log(findSubstring(s1, words1))
console.log(findSubstring(s2, words2))
