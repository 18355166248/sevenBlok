var minDepth = function(root) {
  if (!root) return 0

  if (!root) return 0
  if (!root.left && !root.right) return 1

  let min = +Infinity
  if (root.left) {
    min = Math.min(minDepth(root.left), min)
  }
  if (root.right) {
    min = Math.min(minDepth(root.right), min)
  }
  return min + 1
}
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
)
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
)
