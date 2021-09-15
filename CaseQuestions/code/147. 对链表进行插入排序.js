function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

var insertionSortList = function(head) {
  if (head === null) return head;

  const dummyHead = new ListNode(0);
  dummyHead.next = head;
  let last = head,
    curr = head.next;

  while (curr !== null) {
    if (last.val <= curr.val) {
      last = last.next;
    } else {
      let prev = dummyHead;
      while (prev.next.val <= curr.val) {
        prev = prev.next;
      }
      last.next = curr.next;
      curr.next = prev.next;
      prev.next = curr;
    }

    curr = last.next;
  }

  return dummyHead.next;
};
console.log(
  insertionSortList({
    val: 4,
    next: {
      val: 2,
      next: {
        val: 1,
        next: {
          val: 3,
          next: null,
        },
      },
    },
  })
);
