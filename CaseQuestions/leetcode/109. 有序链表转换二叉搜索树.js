function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}
var sortedListToBST = function(head) {
  const arr = [];
  while (head) {
    arr.push(head.val);
    head = head.next;
  }

  function dfs(treeArr, left, right) {
    if (left > right) return null;

    const mid = Math.floor((left + right + 1) / 2);
    const node = new TreeNode(treeArr[mid]);

    node.left = dfs(treeArr, left, mid - 1);
    node.right = dfs(treeArr, mid + 1, right);

    return node;
  }

  return dfs(arr, 0, arr.length - 1);
};
console.log(
  sortedListToBST({
    val: -10,
    next: {
      val: -3,
      next: {
        val: 0,
        next: {
          val: 5,
          next: {
            val: 9,
          },
        },
      },
    },
  })
);
