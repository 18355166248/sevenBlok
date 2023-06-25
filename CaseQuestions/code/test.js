function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var deleteDuplicates = function(head) {
  if (!head) return null;

  let line = head;
  while (line && line.next) {
    if (line.val === line.next.val) {
      line.next = line.next.next;
    } else {
      line = line.next;
    }
  }
  return head;
};

const l1 = { val: 1, next: { val: 1, next: { val: 2, next: null } } };
const l2 = {
  val: 1,
  next: {
    val: 1,
    next: { val: 2, next: { val: 3, next: { val: 3, next: null } } },
  },
};

console.log(deleteDuplicates(l1));
console.log(deleteDuplicates(l2));

((([])))
