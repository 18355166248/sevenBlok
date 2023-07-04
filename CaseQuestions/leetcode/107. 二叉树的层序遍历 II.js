// 给定一个二叉树，返回其节点值自底向上的层序遍历。 （即按从叶子节点所在层到根节点所在的层，逐层从左向右遍历）
var levelOrderBottom = function(root) {
  const resArr = []

  let arr = [root]
  while (arr.length) {
    const res = []
    const length = arr.length
    for (let i = 0; i < length; i++) {
      const item = arr.shift()
      res.push(item.val)
      item.left && arr.push(item.left)
      item.right && arr.push(item.right)
    }
    resArr.unshift(res)
  }

  return resArr
}
console.log(
  levelOrderBottom({
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
