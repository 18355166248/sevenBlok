// 二叉树的遍历主要有三种：
// （1）先(根)序遍历（根左右）
// （2）中(根)序遍历（左根右）
// （3）后(根)序遍历（左右根）
const tree = {
  val: 1,
  left: {
    val: 2,
    left: {
      val: 3,
    },
  },
  right: {
    val: 4,
    left: {
      val: 5,
    },
    right: {
      val: 6,
    },
  },
};

// 先序遍历
function before(tree) {
  const stack = [tree];

  while (stack.length) {
    const v = stack.pop();
    console.log(v.val);
    v.right && stack.push(v.right);
    v.left && stack.push(v.left);
  }
}

// 中序遍历
function center(root) {
  const stack = [];
  const res = [];

  let p = root;
  while (stack.length || p) {
    // 循环一直添加左节点入栈
    while (p) {
      stack.push(p);
      p = p.left;
    }

    const v = stack.pop();
    res.push(v.val);
    p = v.right;
  }

  return res;
}

// 后序遍历
function after(tree) {
  const stack = [tree];
  const res = [];

  while (stack.length) {
    const v = stack.pop();
    // 非正常版的先序遍历
    res.push(v.val);
    v.left && stack.push(v.left);
    v.right && stack.push(v.right);
  }

  return res.reverse();
}

// console.log(before(tree));
// console.log(center(tree));
console.log(after(tree));
