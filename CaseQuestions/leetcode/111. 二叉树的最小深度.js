var minDepth = function(root) {
  if (!root) return 0;
  if (!root.left && !root.right) return 1;

  let min = +Infinity;
  if (root.left) {
    min = Math.min(minDepth(root.left), min);
  }
  if (root.right) {
    min = Math.min(minDepth(root.right), min);
  }
  return min + 1;
};
console.log(
  minDepth({
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
  })
);
console.log(
  minDepth({
    val: 2,
    right: {
      val: 3,
      right: {
        val: 4,
        right: {
          val: 5,
          right: {
            val: 6,
          },
        },
      },
    },
  })
);

// 给定一个二叉树，找出其最小深度。

// 最小深度是从根节点到最近叶子节点的最短路径上的节点数量。

// 说明：叶子节点是指没有子节点的节点。

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
var minDepth = function(root) {
  if (!root) return 0;
  const stack = [[root, 1]];

  while (stack.length) {
    const [cur, l] = stack.shift();
    if (!cur.left && !cur.right) return l;
    cur.left && stack.push([cur.left, l + 1]);
    cur.right && stack.push([cur.right, l + 1]);
  }
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

console.log(minDepth(tree)); // 2
