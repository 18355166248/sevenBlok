// 给你二叉树的根节点 root 和一个整数目标和 targetSum ，找出所有 从根节点到叶子节点 路径总和等于给定目标和的路径。
// 叶子节点 是指没有子节点的节点。
var pathSum = function(root, targetSum) {
  if (!root) return [];
  let resArr = [];

  dfs(root, 0, []);

  function dfs(node, num, res) {
    if (!node.left && !node.right) {
      if (num + node.val === targetSum) resArr.push([...res, node.val]);
      return;
    }

    if (
      (targetSum >= 0 && num + node.val > targetSum) ||
      (targetSum < 0 && num + node.val < targetSum)
    )
      return;

    node.left && dfs(node.left, num + node.val, [...res, node.val]);
    node.right && dfs(node.right, num + node.val, [...res, node.val]);
  }

  return resArr;
};

console.log(
  pathSum(
    {
      val: 5,
      left: {
        val: 4,
        left: {
          val: 11,
          left: {
            val: 7,
          },
          right: {
            val: 2,
          },
        },
      },
      right: {
        val: 8,
        left: {
          val: 13,
        },
        right: {
          val: 4,
          left: {
            val: 5,
          },
          right: {
            val: 1,
          },
        },
      },
    },
    22
  )
);
console.log(
  pathSum(
    {
      val: 1,
      left: {
        val: 2,
      },
      right: {
        val: 3,
      },
    },
    5
  )
);
console.log(
  pathSum(
    {
      val: 1,
      left: {
        val: 2,
      },
    },
    0
  )
);
console.log(pathSum(null, 0));
console.log(
  pathSum(
    {
      val: -2,
      right: {
        val: -3,
      },
    },
    -5
  )
);
