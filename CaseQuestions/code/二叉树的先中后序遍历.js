// 二叉树的遍历主要有三种：
// （1）先(根)序遍历（根左右）
// （2）中(根)序遍历（左根右）
// （3）后(根)序遍历（左右根）
const tree = {
  val: 1,
  left: {
    val: 2,
    left: {
      val: 3,
    },
  },
  right: {
    val: 4,
    left: {
      val: 5,
    },
    right: {
      val: 6,
    },
  },
};

// 1. 先序遍历
function before(tree) {
  function dfs(tree) {
    console.log(tree.val);
    tree.left && dfs(tree.left);
    tree.right && dfs(tree.right);
  }
  dfs(tree);
}

console.log(before(tree));
