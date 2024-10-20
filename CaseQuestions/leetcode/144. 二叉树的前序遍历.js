var preorderTraversal = function(root) {
  if (root === null) return [];
  const arr = [];
  dfs(root);

  return arr;

  function dfs(root) {
    if (!root) return;

    arr.push(root.val);

    dfs(root.left);
    dfs(root.right);
  }
};
console.log(
  preorderTraversal({
    val: 1,
    left: null,
    right: {
      val: 2,
      left: {
        val: 3,
      },
      right: null,
    },
  })
);
console.log(preorderTraversal(null));
console.log(
  preorderTraversal({
    val: 1,
    left: { val: 4, left: { val: 2, left: null, right: null }, right: null },
    right: { val: 3, left: null, right: null },
  })
);
