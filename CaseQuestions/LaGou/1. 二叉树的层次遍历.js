function getTree(tree) {
  const arr = [];

  get(tree);

  return arr;

  function get(tree, level = 0) {
    if (Array.isArray(arr[level])) {
      arr[level].push(tree.val);
    } else {
      arr[level] = [tree.val];
    }

    if (tree.left) {
      get(tree.left, level + 1);
    }

    if (tree.right) {
      get(tree.right, level + 1);
    }
  }
}

function getTree2(tree) {
  const arr = [];
  let root = [tree];

  while (root.length > 0) {
    const curResult = [];
    const curRoot = [];
    root.forEach((item) => {
      curResult.push(item.val);

      if (item.left) curRoot.push(item.left);
      if (item.right) curRoot.push(item.right);
    });

    arr[arr.length] = curResult;
    root = curRoot;
  }

  return arr;
}

const tree = {
  val: 3,
  left: {
    val: 9,
  },
  right: {
    val: 8,
    left: { val: 6 },
    right: { val: 7 },
  },
};

// console.log(getTree(tree));
console.log(getTree2(tree));
