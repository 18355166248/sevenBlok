var isBalanced = function(root) {
  return height(root) >= 0
}

function height(root) {
  if (!root) return 0

  let leftHeight, righttHeight

  if (
    (leftHeight = height(root.left)) === -1 ||
    (righttHeight = height(root.right)) === -1 ||
    Math.abs(leftHeight - righttHeight) > 1
  ) {
    return -1
  } else {
    return Math.max(leftHeight, righttHeight) + 1
  }
}
console.log(
  isBalanced({
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
)
console.log(
  isBalanced({
    val: 1,
    left: {
      val: 2,
      left: {
        val: 3,
        left: {
          val: 4,
        },
        right: {
          val: 4,
        },
      },
      right: {
        val: 3,
      },
    },
    right: {
      val: 2,
    },
  })
)
