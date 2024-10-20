// 给你单链表的头节点 head ，请你反转链表，并返回反转后的链表。

function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function(head) {
  if (!head) return null;

  let prev = null; // 记录前一个节点
  let cur = head; // 记录当前节点

  while (cur) {
    const next = cur.next; // 记录下一个节点
    cur.next = prev; // 将当前节点的下一个节点指向上一个节点
    prev = cur; // 更新上一个节点为当前节点
    cur = next; // 更新当前节点为下一个
  }

  return prev;
};

// 123  23  3
// 2.next.next = 2     2.next = nul   3
// 1.next.next = 1     1.next = null  3


console.log(
  JSON.stringify(
    reverseList({
      val: 1,
      next: { val: 2, next: { val: 3, next: { val: 4, next: { val: 5 } } } },
    })
  )
);

console.log(
  reverseList({
    val: 1,
    next: { val: 2, next: { val: 3 } },
  })
);

console.log(reverseList(null));
