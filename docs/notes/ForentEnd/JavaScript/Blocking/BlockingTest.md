# 测试代码

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
