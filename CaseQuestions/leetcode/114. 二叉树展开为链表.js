var flatten = function(root) {
  const arr = []

  dfs(root)
  for (let i = 1; i < arr.length; i++) {
    const prev = arr[i - 1],
      cur = arr[i]
    prev.left = null
    prev.right = cur
  }

  function dfs(node) {
    if (!node) return null

    arr.push(node)
    dfs(node.left)
    dfs(node.right)

    return node
  }
}
console.log(
  flatten({
    val: 1,
    left: {
      val: 2,
      left: {
        val: 3,
      },
      right: {
        val: 4,
      },
    },
    right: {
      val: 5,
      right: {
        val: 6,
      },
    },
  })
)
function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val
  this.left = left === undefined ? null : left
  this.right = right === undefined ? null : right
}
