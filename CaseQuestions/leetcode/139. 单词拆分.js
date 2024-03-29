var wordBreak = function(s, wordDict) {
  const length = s.length;
  const set = new Set(wordDict);
  const dp = Array(length + 1).fill(false);
  dp[0] = true;

  for (let i = 0; i <= length; i++) {
    for (let j = 0; j < i; j++) {
      // console.log(i, j, s.substr(j, i - j));
      if (dp[j] && set.has(s.substr(j, i - j))) {
        // console.log("add", i, j);
        dp[i] = true;
        break;
      }
    }
  }

  return dp[length];
};
console.log(wordBreak("leetcode", ["leet", "code"]));
console.log(wordBreak("applepenapple", ["apple", "pen"]));
console.log(wordBreak("catsandog", ["cats", "dog", "sand", "and", "cat"]));
