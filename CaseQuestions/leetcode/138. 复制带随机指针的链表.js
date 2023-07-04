var copyRandomList = function(head, map = new Map()) {
  if (head === null) return null;

  if (!map.get(head)) {
    map.set(head, { val: head.val });
    Object.assign(map.get(head), {
      next: copyRandomList(head.next, map),
      random: copyRandomList(head.random, map),
    });
  }

  return map.get(head);
};
function Node(val, next, random) {
  this.val = val;
  this.next = next;
  this.random = random;
}

var node1 = { val: 1, next: null };
var node2 = { val: 10, next: node1 };
var node3 = { val: 11, next: node2 };
var node4 = { val: 13, next: node3 };
var node5 = { val: 7, next: node4, random: null };
node1.random = node4;
node2.random = node3;
node3.random = node1;
node4.random = node5;
console.log(copyRandomList(node5));
