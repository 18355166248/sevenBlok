// 给你两个 非空 的链表，表示两个非负的整数。它们每位数字都是按照 逆序 的方式存储的，并且每个节点只能存储 一位 数字。

// 请你将两个数相加，并以相同形式返回一个表示和的链表。

// 你可以假设除了数字 0 之外，这两个数都不会以 0 开头。

function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}
var addTwoNumbers = function(l1, l2) {
  if (l1 === null) return l2;
  if (l2 === null) return l1;

  const newL = new ListNode();
  let cur = newL;
  let remain = 0;
  while (l1 || l2) {
    const l1Val = l1 ? l1.val : 0
    const l2Val = l2 ? l2.val : 0
    const val = l1Val + l2Val + remain;
    remain = Math.floor(val / 10);
    const _val = val % 10;
    cur.next = new ListNode(_val);
    cur = cur.next;
    l1 && (l1 = l1.next);
    l2 && (l2 = l2.next);
  }
  if (remain) {
    cur.next = new ListNode(remain);
  }

  return newL.next;
};

const l1 = { val: 2, next: { val: 4, next: { val: 3, next: null } } };
const l2 = { val: 5, next: { val: 6, next: { val: 4, next: null } } };

console.log(addTwoNumbers(l1, l2));
