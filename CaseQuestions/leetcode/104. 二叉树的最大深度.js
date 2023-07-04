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
 * @return {number}
 */
var maxDepth = function(root) {
  if (!root) return 0;
  let deep = 1;

  function dfs(tree, d) {
    if (!tree) return;

    tree.left && dfs(tree.left, d + 1);
    tree.right && dfs(tree.right, d + 1);

    if (!tree.left && !tree.right) {
      deep = Math.max(deep, d);
    }
  }

  dfs(root, deep);

  return deep;
};

const tree = {
  val: 3,
  left: {
    val: 9,
  },
  right: {
    val: 20,
    left: {
      val: 15,
    },
    right: {
      val: 7,
    },
  },
};

console.log(maxDepth(tree));
