# 剑指 Offer 38. 字符串的排列

```js
 ```var permutation = function(s) {
  // 这里用set的原因是因为假如说字符串 aab 前两个字符是相等的, 我们是通过索引去拼接字符串的
  // 所以会出现2个aab(012) aab(102)这种情况, 所以用Set格式做数组的去重
  const arr = new Set();

  const visit = {}; // 缓存已经用过的字符索引

  function dfs(path) {
    if (path.length === s.length) arr.add(path);
    for (let i = 0; i < s.length; i++) {
      if (visit[i]) continue;
      visit[i] = true; // 在递归之前缓存当前循环已经使用过的字符串的索引, 避免在递归循环中再次使用相同字符串拼接
      // 这里用递归的方式再次循环字符串, 将没有使用过的字符串拼接上, 并打上已经使用的标识
      // 已经使用的标识去除的时机就在递归的方法执行完毕的时候, 这个时候需要将当前字符串已经使用过的标识去除, 用于下一次当前循环需要使用字符串, 这样的话就可以按照上图执行的顺序, 依次拼接
      dfs(path + s[i]);
      visit[i] = false;
    }
  }

  dfs("");

  return [...set];
};

console.log(permutation("abc"));
