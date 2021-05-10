var leafSimilar = function(root1, root2) {
  let oneStr = [],
    twoStr = [];

  getVal(root1, oneStr);
  getVal(root2, twoStr);

  return oneStr.join("+") === twoStr.join("+");

  function getVal(r, arr) {
    if (r === undefined || r === null) return;

    if (!r.left && !r.right) {
      arr.push(r.val);
    } else {
      getVal(r.left, arr);
      getVal(r.right, arr);
    }
  }
};

const root1 = {
  val: 3,
  left: {
    val: 5,
    left: {
      val: 6,
    },
    right: {
      val: 2,
      left: {
        val: 7,
      },
      right: {
        val: 4,
      },
    },
  },
  right: {
    val: 1,
    left: { val: 9 },
    right: { val: 8 },
  },
};

const root2 = {
  val: 3,
  left: {
    val: 5,
    left: { val: 6 },
    right: { val: 7 },
  },
  right: {
    val: 1,
    left: { val: 4 },
    right: {
      val: 2,
      left: { val: 9 },
      right: { val: 8 },
    },
  },
};

console.log(leafSimilar(root1, root2));
