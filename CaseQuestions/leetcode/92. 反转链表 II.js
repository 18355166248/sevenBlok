var reverseBetween = function(head, left, right) {
  const dummy_node = { next: null }
  dummy_node.next = head
  let pre = dummy_node
  for (let i = 0; i < left - 1; i++) {
    pre = pre.next
  }

  let cur = pre.next
  for (let i = 0; i < right - left; i++) {
    const next = cur.next
    cur.next = next.next
    next.next = pre.next
    pre.next = next
  }

  return dummy_node.next
}
console.log(
  reverseBetween(
    {
      val: 1,
      next: {
        val: 2,
        next: {
          val: 3,
          next: {
            val: 4,
            next: {
              val: 5,
              next: null,
            },
          },
        },
      },
    },
    2,
    4
  )
)
