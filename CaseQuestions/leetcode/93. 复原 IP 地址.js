// 给定一个只包含数字的字符串，用以表示一个 IP 地址，返回所有可能从 s 获得的 有效 IP 地址 。你可以按任何顺序返回答案。
// 有效 IP 地址 正好由四个整数（每个整数位于 0 到 255 之间组成，且不能含有前导 0），整数之间用 '.' 分隔。
// 例如："0.1.2.201" 和 "192.168.1.1" 是 有效 IP 地址，但是 "0.011.255.245"、"192.168.1.312" 和 "192.168@1.1" 是 无效 IP 地址。
var restoreIpAddresses = function(s) {
  if (s.length > 12) return [];
  const set = new Set();

  function dfs(arr, i) {
    if (arr.length === 4 && i === s.length) {
      return set.add(arr.join("."));
    }

    for (let j = i + 1; j < Math.min(i + 4, s.length + 1); j++) {
      if (j === i + 1) {
        dfs([...arr, +s[j - 1]], j);
      } else if (s[i] !== "0") {
        const num = +s.substring(i, j);
        if (num <= 255) dfs([...arr, num], j);
      }
    }
  }

  dfs([], 0);

  return [...set];
};
console.log(restoreIpAddresses("25525511135"));
console.log(restoreIpAddresses("0000"));
console.log(restoreIpAddresses("1111"));
console.log(restoreIpAddresses("010010"));
