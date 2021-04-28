const obj = {
  a: [1, 2, null],
  b: {
    c: 2,
    d: function() {
      this.c = 3;
      console.log("obj.b.d");
    },
    e: undefined,
  },
  e: null,
  f: () => {
    console.log("hello");
  },
  g: undefined,
};
obj.target = obj;

// 首先考虑是不是对象 如果不是对象 就直接返回赋值
// 数组类型判断也是对象 所以在还得二次判断是不是数组, 进行初始化数据格式
// for in 循环遍历对象(数组)进行赋值
// 可能存在循环引用, 所以需要用一个哈希缓存之前设置过的对象(数组)
function deepClone(obj, map = new WeakMap()) {
  if (typeof obj === "object" && obj !== null) {
    const cloneObj = Array.isArray ? [] : {};

    if (map.get(obj)) return map.get(obj);

    map.set(obj, cloneObj);
    for (const key in obj) {
      cloneObj[key] = deepClone(obj[key], map);
    }

    return cloneObj;
  } else {
    return obj;
  }
}

const cloneObj1 = deepClone(obj);
// obj.f = 666;
console.log(cloneObj1);
