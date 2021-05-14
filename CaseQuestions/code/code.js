var permutation = function(s) {
  if (s.length <= 1) return [s];

  const set = new Set();
  const obj = {};

  const dfs = function(path) {
    if (path.length === s.length) set.add(path);
    for (let i = 0; i < s.length; i++) {
      if (obj[i]) continue;
      obj[i] = true;
      dfs(path + s[i]);
      obj[i] = false;
    }
  };

  dfs("");

  return [...set];
};

const s = "aab";

console.log(permutation(s));
