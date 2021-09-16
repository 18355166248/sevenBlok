function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

var sortList = function(head) {
  if (head === null) return head;

  const start = new ListNode(0);
  start.next = head;
  let last = head,
    curr = head.next;
  while (curr !== null) {
    console.log(curr, last);
    if (last.val <= curr.val) {
      last = last.next;
    } else {
      let prev = start;
      while (prev.next.val <= curr.val) {
        prev = prev.next;
      }
      last.next = curr.next; // 缓存待插入节点
      curr.next = prev.next; // 讲插入节点和下一个节点续接上
      prev.next = curr;
    }

    curr = last.next; // 更新待插入节点
  }

  return JSON.stringify(start.next);
};
// console.log(
//   sortList({
//     val: 4,
//     next: {
//       val: 2,
//       next: {
//         val: 1,
//         next: {
//           val: 3,
//           next: null,
//         },
//       },
//     },
//   })
// );
console.log(
  sortList({
    val: -1,
    next: {
      val: 5,
      next: {
        val: 3,
        next: {
          val: 4,
          next: {
            val: 0,
            next: null,
          },
        },
      },
    },
  })
);
