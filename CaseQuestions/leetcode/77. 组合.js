// 给定两个整数 n 和 k，返回 1 ... n 中所有可能的 k 个数的组合。
var combine = function(n, k) {
  const result = [];

  function dfs(start, n, k, res) {
    if (res.length + (n - start + 1) < k) return;

    if (res.length === k) return result.push(res);

    dfs(start + 1, n, k, [...res, start]);
    dfs(start + 1, n, k, res);
  }

  dfs(1, n, k, []);

  return result;
};
console.log(combine(4, 2)); //
