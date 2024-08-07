// 给你一个链表的头节点 head 和一个特定值 x ，请你对链表进行分隔，使得所有 小于 x 的节点都出现在 大于或等于 x 的节点之前。
// 你应当 保留 两个分区中每个节点的初始相对位置。
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val
  this.next = next === undefined ? null : next
}
var partition = function(head, x) {
  let small = new ListNode()
  const smallHead = small
  let large = new ListNode()
  const largeHead = large

  while (head) {
    if (head.val < x) {
      small.next = head
      small = small.next
    } else {
      large.next = head
      large = large.next
    }
    head = head.next
  }

  large.next = null
  small.next = largeHead.next

  return smallHead.next
}
console.log(
  partition(
    {
      val: 1,
      next: {
        val: 4,
        next: {
          val: 3,
          next: {
            val: 2,
            next: {
              val: 5,
              next: {
                val: 2,
                next: null,
              },
            },
          },
        },
      },
    },
    3
  )
) // [1,2,2,4,3,5]
