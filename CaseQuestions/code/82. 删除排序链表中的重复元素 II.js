// 存在一个按升序排列的链表，给你这个链表的头节点 head ，请你删除链表中所有存在数字重复情况的节点，只保留原始链表中 没有重复出现 的数字。
// 返回同样按升序排列的结果链表。
var deleteDuplicates = function(head) {
  if (head === null || head.next === null) return head

  const obj = {}
  while (head) {
    if (obj[head.val]) {
      obj[head.val] += 1
    } else {
      obj[head.val] = 1
    }
    head = head.next
  }

  const prevRes = { next: null }
  let res = prevRes
  Object.keys(obj)
    .sort((a, b) => +a - b)
    .forEach((key) => {
      if (obj[key] === 1) {
        res.next = { val: key, next: null }
        res = res.next
      }
    })

  return prevRes.next
}
// console.log(
//   deleteDuplicates({
//     val: 1,
//     next: {
//       val: 2,
//       next: {
//         val: 3,
//         next: {
//           val: 3,
//           next: {
//             val: 4,
//             next: {
//               val: 4,
//               next: {
//                 val: 5,
//               },
//             },
//           },
//         },
//       },
//     },
//   })
// )

// console.log(
//   deleteDuplicates({
//     val: 1,
//     next: {
//       val: 1,
//       next: null,
//     },
//   })
// )

console.log(
  deleteDuplicates({
    val: -3,
    next: {
      val: -1,
      next: {
        val: -1,
        next: {
          val: 0,
          next: {
            val: 0,
            next: {
              val: 0,
              next: {
                val: 0,
                next: {
                  val: 0,
                  next: {
                    val: 2,
                    next: null,
                  },
                },
              },
            },
          },
        },
      },
    },
  })
)
