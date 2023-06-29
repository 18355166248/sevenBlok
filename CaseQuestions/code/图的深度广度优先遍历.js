const graph = {
  0: [1, 2],
  1: [2],
  2: [0, 3],
  3: [3],
};

const visited = new Set();
// 深度
const dfs = (n) => {
  console.log(n);
  visited.add(n);
  graph[n].forEach((c) => {
    if (!visited.has(c)) {
      dfs(c);
    }
  });
};

// dfs(2);

const bfs = (n) => {
  const q = [n];

  while (q.length) {
    const v = q.shift();
    visited.add(v);
    console.log(v);
    graph[v].forEach((c) => {
      if (!visited.has(c)) {
        q.push(c);
      }
    });
  }
};

bfs(2);
