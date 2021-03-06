// 给你一个链表数组，每个链表都已经按升序排列。

const e = require('express')

// 请你将所有链表合并到一个升序链表中，返回合并后的链表
var mergeKLists = function(lists) {
  let prevLine = null

  for (let i = 0; i < lists.length; i++) {
    prevLine = merge2List(prevLine, lists[i])
  }

  return prevLine
}

function merge2List(l1, l2) {
  const headLine = {}
  let head = headLine
  while (l1 && l2) {
    if (l1.val < l2.val) {
      head.next = l1
      l1 = l1.next
    } else {
      head.next = l2
      l2 = l2.next
    }
    head = head.next
  }

  head.next = l1 === null ? l2 : l1

  return headLine.next
}

const lists = [
  { val: 1, next: { val: 4, next: { val: 5, next: null } } },
  { val: 1, next: { val: 3, next: { val: 4, next: null } } },
  { val: 2, next: { val: 6, next: null } },
]

console.log(JSON.stringify(mergeKLists(lists)))
