function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}
var isSameTree = function(p, q) {
  let isSame = true;
  function inorder(root1, root2) {
    if (!root1 && !root2) return;
    if (!isSame) return;
    if (!root1) return (isSame = false);
    if (!root2) return (isSame = false);
    if (root1.val !== root2.val) return (isSame = false);
    inorder(root1.left, root2.left);
    inorder(root1.right, root2.right);
  }
  inorder(p, q);

  return isSame;
};

var isSameTree = function(p, q) {
  if (!p && !q) return true;

  if (
    p &&
    q &&
    p.val === q.val &&
    isSameTree(p.left, q.left) &&
    isSameTree(p.right, q.right)
  ) {
    return true;
  }
  return false;
};

const p = {
  val: 1,
  left: {
    val: 2,
  },
  right: {
    val: 3,
  },
};

const q = {
  val: 1,
  left: {
    val: 2,
  },
  right: {
    val: 3,
  },
};
console.log(isSameTree(p, q));

const p1 = {
  val: 1,
  left: {
    val: 1,
  },
};

const q1 = {
  val: 1,
  right: {
    val: 1,
  },
};
console.log(isSameTree(p1, q1));
