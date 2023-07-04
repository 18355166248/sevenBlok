// 给你一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} n
 * @return {ListNode}
 */
var removeNthFromEnd = function(head, n) {
  let length = 0;
  let headCopy = head;
  const map = new Map();
  while (headCopy) {
    length++;
    map.set(length, headCopy);
    headCopy = headCopy.next;
  }
  const index = length - n;

  if (index <= 0) {
    if (length <= 1) {
      return null;
    }

    return map.get(2);
  } else {
    map.get(index).next = map.get(index + 2) || null;
  }

  return head;
};

// console.log(
//   removeNthFromEnd(
//     {
//       val: 1,
//       next: {
//         val: 2,
//         next: { val: 3, next: { val: 4, next: { val: 5, next: null } } },
//       },
//     },
//     2
//   )
// ); // [1,2,3,5]

// console.log(
//   removeNthFromEnd(
//     {
//       val: 1,
//       next: null,
//     },
//     1
//   )
// ); // []
// console.log(
//   removeNthFromEnd(
//     {
//       val: 1,
//       next: {
//         val: 2,
//         next: null,
//       },
//     },
//     1
//   )
// ); // [1]
console.log(
  removeNthFromEnd(
    {
      val: 1,
      next: {
        val: 2,
        next: null,
      },
    },
    2
  )
); // [2]
