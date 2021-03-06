const { object } = require('assert-plus')

function createConst(obj) {
  const keys = Object.getOwnPropertyNames(obj)

  keys.forEach(key => {
    const prop = obj[key]

    if (typeof prop === 'object' && prop !== null) {
      obj[key] = createConst(prop)
    }
  })

  Object.freeze(obj)

  return new Proxy(obj, {
    deleteProperty: function (target, key) {
      throw new Error('不能删除' + key)
    },
    get: function (target, key) {
      console.log(target, key)
      if (!target.hasOwnProperty(key)) {
        throw new Error(key + '不存在')
      } else {
        return target[key]
      }
    },
    set: function (target, key) {
      console.log(key)
      throw new Error('不能修改'+key)
    }
  })

}

const settings = {
  appName:"fan",
  info: {p1:200,p2:300 }
};

const o = createConst(settings)

// settings.appName = 1 ;

// o.other = "abc";

// console.log(o.a)

// o.info.p1 = 100;

delete o.info.p1

console.info(o)
