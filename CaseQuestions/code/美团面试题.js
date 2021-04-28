// 实现一个深拷贝
const obj = {
  a: [1, 2, null],
  b: {
    c: 2,
    d: function() {},
    e: undefined,
  },
  e: null,
  f: () => {
    console.log("hello");
  },
  g: undefined,
};

// 打平的数组转成树形数组

const arr = [
  { id: 1, parentId: null },
  { id: 3, parentId: 2 },
  { id: 2, parentId: 1 },
  { id: 5, parentId: 3 },
  { id: 6, parentId: 3 },
];

const arr1 = [
  {
    id: 1,
    children: [
      {
        id: 2,
        children: [
          {
            id: 3,
            children: [{ id: 5 }, { id: 6 }],
          },
        ],
      },
    ],
  },
];
