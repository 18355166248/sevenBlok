// 给定一个头结点为 head 的非空单链表，返回链表的中间结点。
// 如果有两个中间结点，则返回第二个中间结点。
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var middleNode = function(head) {
  let length = 0;
  let headCopy = head;
  const map = new Map();
  while (headCopy) {
    length++;
    map.set(length, headCopy);
    headCopy = headCopy.next;
  }
  const index = Math.ceil((length + 1) / 2);
  return map.get(index);
};

console.log(
  middleNode({
    val: 1,
    next: {
      val: 2,
      next: { val: 3, next: { val: 4, next: { val: 5, next: null } } },
    },
  })
); // [3,4,5]
console.log(
  middleNode({
    val: 1,
    next: {
      val: 2,
      next: {
        val: 3,
        next: { val: 4, next: { val: 5, next: { val: 6, next: null } } },
      },
    },
  })
); // [3,4,5]
