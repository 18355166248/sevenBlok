function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}
/**
 * @param {TreeNode} root
 * @return {TreeNode}
 */
var invertTree = function(root) {
  if (!root) return null;
  return new TreeNode(root.val, invertTree(root.right), invertTree(root.left));
};

//         4
//    2        3
// 7     1  6      9

//         4
//    3        2
// 9     6  1      7

console.log(
  JSON.stringify(
    invertTree({
      val: 4,
      left: {
        val: 2,
        left: {
          val: 7,
        },
        right: {
          val: 1,
        },
      },
      right: {
        val: 3,
        left: {
          val: 6,
        },
        right: {
          val: 9,
        },
      },
    })
  )
);
