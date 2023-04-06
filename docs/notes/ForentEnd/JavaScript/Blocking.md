# 控制器

> 状态控制器, 通过初始化传入回调函数, 判断不同阶层下的状态

- 这个需求是在项目中如果多页面可能需要判断是否可以离开的状态, 这个时候就可以通过 Blocking 初始化每个页面的状态
- 然后可以多层级传回调函数
- 也可以销毁不需要判断的层级(两种方案, 具体看测试用例)

::: details 点击查看实现代码

```js
import _ from "lodash";

// 离开状态管理
class Blocking {
  chainSymbol = ".";

  constructor() {
    this._statusId = 0;
    this.leaveStates = { id: this._statusId };
  }

  // 创建依赖关系
  add(name, callback = () => true) {
    if (!name || !_.isString(name)) {
      throw new Error("param of add must be string");
    }

    const chainList = name.split(this.chainSymbol);

    // 如果依赖关系是正确的就返回需要创建参数的父级parent, 当前集current 和 创建集的name 否则报错
    const result = findParent(chainList, this.leaveStates, this);

    result.parent[result.name] = {
      ...result.current,
      id: ++this._statusId,
      onCallback: callback
    };

    return () => {
      Object.keys(result.parent[result.name]).forEach(
        key => delete result.parent[result.name][key]
      );
    };
  }

  /**
   * 输入一层值, 判断其及他的子集是否满足离开页面条件
   * @param name a.b.c 格式 表示判断哪一层级是否满足离开页面条件
   * 返回true代表可以离开, 返回false代表不可以离开
   */
  canLeave(name) {
    if (!name || !_.isString(name)) {
      return Promise.reject("param of canLeave must be string");
    }

    const chainList = name.split(this.chainSymbol);

    const canLeave = findParent(chainList, this.leaveStates);

    if (canLeave.current) {
      // current有值的情况下 表示有需要执行的子集, 递归执行获取结果
      return onChildrenCallback(canLeave.current);
    } else {
      // 如果没有current 代表没有需要执行的子集 所以默认返回true
      return Promise.resolve(true);
    }
  }

  // 销毁
  remove(name) {
    if (!name || !_.isString(name)) {
      throw new Error("param of canLeave must be string");
    }

    const chainList = name.split(this.chainSymbol);

    const findResult = onFindStateByName(chainList, this.leaveStates);

    if (
      findResult.parent &&
      findResult.name &&
      findResult.parent[findResult.name]
    ) {
      delete findResult.parent[findResult.name];
    }
  }
}

// 判断是否存在依赖关系的父级
function findParent(chainList, parent, that) {
  if (chainList.length === 1) {
    // 递归到最后一层(创建层)了, 所以返回父集, 当前集进行创建新的依赖
    return {
      parent,
      current: parent[chainList[0]],
      name: chainList[0]
    };
  } else if (parent?.[chainList[0]]) {
    // 递归将当前集合新的列表向下传递,去查询
    const parentItem = findParent(
      chainList.slice(1),
      parent?.[chainList[0]],
      that
    );

    // 如果有返回值 将其返回 否则返回报错信息
    if (parentItem && parentItem.name && parentItem.parent) {
      return parentItem;
    }
  } else {
    // 既不是最后一层, 也不是有向下递归的情况, 表示没有实例 创建一个默认实例, 继续递归往下
    parent[chainList[0]] = {
      id: ++that._statusId,
      onCallback: () => true
    };

    // 递归将当前集合新的列表向下传递,去查询
    const parentItem = findParent(
      chainList.slice(1),
      parent?.[chainList[0]],
      that
    );

    // 如果有返回值 将其返回 否则返回报错信息
    if (parentItem && parentItem.name && parentItem.parent) {
      return parentItem;
    }
  }
}

// 执行当前及子集onCallback
function onChildrenCallback(leaveStatus) {
  return new Promise((resolve, reject) => {
    let isLeave = true;
    let onOff = false;

    if (_.isFunction(leaveStatus.onCallback)) {
      const callBackResult = leaveStatus.onCallback();

      if (
        Object.prototype.toString.call(callBackResult) === "[object Promise]"
      ) {
        // 处理异步函数
        onOff = true;

        callBackResult
          .then(res => {
            onOff = false;

            isLeave = res;

            if (!isLeave) {
              resolve(false);

              return;
            }

            if (!onOff) {
              if (Object.keys(leaveStatus).length <= 2) {
                resolve(isLeave);
              }

              for (let key in leaveStatus) {
                if (key !== "id" && key !== "onCallback") {
                  onChildrenCallback(leaveStatus[key])
                    .then(res => {
                      resolve(res);
                    })
                    .catch(err => {
                      reject(err);
                    });
                }
              }
            }
          })
          .catch(err => {
            reject(err);
          });
      }

      if (
        Object.prototype.toString.call(callBackResult) === "[object Boolean]"
      ) {
        isLeave = callBackResult;
      }
    }

    if (!isLeave) {
      resolve(false);

      return;
    }

    if (!onOff) {
      if (Object.keys(leaveStatus).length <= 2) {
        resolve(isLeave);

        return;
      }

      const objLength = Object.keys(leaveStatus).length;
      let num = 2;

      for (let key in leaveStatus) {
        if (key !== "id" && key !== "onCallback") {
          onChildrenCallback(leaveStatus[key])
            .then(res => {
              num++;

              if (!res) {
                resolve(res);

                return;
              }

              if (num === objLength) {
                resolve(res);
              }
            })
            .catch();
        }
      }
    }
  });
}

/**
 * 通过id找集合
 * @param id
 * @param currentList  当前集合
 * @param parent 父集
 * @returns {*}
 */
// function onFindStateById(id, currentList) {
//   let state;
//
//   if (currentList.id === Number(id)) {
//     state = currentList;
//   } else {
//     for (let key in currentList) {
//       if (key !== 'id' && key !== 'onCallback') {
//         const findResult = onFindStateById(id, currentList[key]);
//
//         if (findResult.state) {
//           break;
//         }
//       }
//     }
//   }
//
//   return { id, state };
// }

/**
 * 通过名字找集合
 * @param nameList {array}
 * @param currentList {object} 当前集合
 */
function onFindStateByName(nameList, currentList) {
  if (nameList.length === 1) {
    return {
      name: nameList[0],
      current: currentList[nameList[0]],
      parent: currentList
    };
  }

  if (currentList[nameList[0]]) {
    return onFindStateByName(nameList.slice(1), currentList[nameList[0]]);
  }
}

export default Blocking;
```

:::


## 测试代码

::: details 点击查看测试代码

```js
import LeaveStatesMange from "./Blocking.constructor";
import "regenerator-runtime/runtime";

let leaveStates;

describe("测试 LeaveStatesMange", () => {
  beforeEach(() => {
    leaveStates = new LeaveStatesMange();
  });

  test("匹配快照", () => {
    expect(leaveStates).toMatchSnapshot();
  });

  test("测试类 LeaveStatesMange", () => {
    expect(leaveStates).toBeInstanceOf(LeaveStatesMange);
  });

  test("初始化是否包含 _statusId, chainSymbol, leaveStates, add, canLeave, remove", () => {
    expect(leaveStates).toHaveProperty("_statusId", 0);
    expect(leaveStates).toHaveProperty("chainSymbol", ".");
    expect(leaveStates).toHaveProperty("leaveStates.id", 0);
    expect(leaveStates).toHaveProperty("canLeave");
    expect(leaveStates).toHaveProperty("add");
    expect(leaveStates).toHaveProperty("remove");
  });

  test("执行销毁方法1", async () => {
    leaveStates.add("a.b", () => false);

    const result = await leaveStates.canLeave("a");

    expect(result).toBe(false);

    leaveStates.remove("a.b");

    const result2 = await leaveStates.canLeave("a");

    expect(result2).toBe(true);

    function getError() {
      leaveStates.remove(false);
    }

    expect(getError).toThrowError(
      new Error("param of canLeave must be string")
    );
  });

  test("执行销毁方法2", () => {
    // 返回销毁方法
    const destroyState = leaveStates.add("a");

    leaveStates.add("a.b.c");

    destroyState();

    expect(leaveStates.leaveStates.a).toMatchObject({});
  });

  test("执行canLeave方法", async () => {
    leaveStates.add("a");
    leaveStates.add("a.b.c1", () => true);
    leaveStates.add("a.b.c", () => false);
    leaveStates.add("a.b");

    const result = await leaveStates.canLeave("a.b");

    expect(result).toBe(false);

    leaveStates.add("a.b.c", () => true);

    const result2 = await leaveStates.canLeave("a.b");

    expect(result2).toBe(true);

    try {
      await leaveStates.canLeave(true);
    } catch (err) {
      expect(err).toBe("param of canLeave must be string");
    }

    try {
      await leaveStates.canLeave(false);
    } catch (err) {
      expect(err).toBe("param of canLeave must be string");
    }

    const result3 = await leaveStates.canLeave("a.b.c.d");

    expect(result3).toBe(true);
  });

  test("执行异步回调", async () => {
    const leaveStates = new LeaveStatesMange();

    leaveStates.add("a.b", () => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(false);
        }, 1000);
      });
    });

    const result = await leaveStates.canLeave("a.b");

    expect(result).toBe(false);

    leaveStates.add("a.b.c");

    const result1 = await leaveStates.canLeave("a.b.c");

    expect(result1).toBe(true);
  });

  it("捕捉错误", async () => {
    leaveStates.add("a", () => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(true);
        }, 1000);
      });
    });

    leaveStates.add("a.b", () => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(true);
        }, 1000);
      });
    });

    leaveStates.add("a.b.c", () => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(true);
        }, 1000);
      });
    });

    leaveStates.add("a.b1", () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject("throw err");
        }, 1000);
      });
    });

    try {
      const res = await leaveStates.canLeave("a.b");

      expect(res).toBe(true);
    } catch (err) {
      expect(err).toBe("throw err");
    }

    try {
      await leaveStates.canLeave("a");
    } catch (err) {
      expect(err).toBe("throw err");
    }

    function onThrowErr() {
      leaveStates.add(["a", "b"]);
    }

    expect(onThrowErr).toThrowError(new Error("param of add must be string"));
  });
});
```

:::
