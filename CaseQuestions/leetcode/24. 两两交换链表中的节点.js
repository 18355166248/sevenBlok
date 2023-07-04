// 给定一个链表，两两交换其中相邻的节点，并返回交换后的链表。

// 你不能只是单纯的改变节点内部的值，而是需要实际的进行节点交换。
var swapPairs = function(head) {
  if (head === null) return null
  if (head.next === null) return head
  const prevLine = { next: head }
  head = prevLine
  let left = head.next
  let right = left.next

  while (left && right) {
    const nextLine = right.next
    head.next = right
    head.next.next = left
    head = head.next.next
    left = nextLine
    right = left ? left.next : null
  }

  head.next = left ? left : right

  return prevLine.next
}

const line = {
  val: 1,
  next: { val: 2, next: { val: 3, next: { val: 4, next: null } } },
}
const line2 = {
  val: 1,
  next: { val: 2, next: { val: 3, next: null } },
}

console.log(JSON.stringify(swapPairs(line)))
console.log(JSON.stringify(swapPairs(line2)))
