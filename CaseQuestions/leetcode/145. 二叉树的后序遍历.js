/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var postorderTraversal = function(root) {
  if (root === null) return [];
  const res = [];
  dfs(root);
  return res;
  function dfs(node) {
    if (!node) return;

    dfs(node.left);
    dfs(node.right);
    res.push(node.val);
  }
};
console.log(
  postorderTraversal({
    val: 1,
    left: null,
    right: {
      val: 2,
      left: {
        val: 3,
      },
    },
  })
);
