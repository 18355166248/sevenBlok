# schedule并发限制

```js
class Scheduler {
  constructor() {
    this.max = 2;
    this.taskNum = 0;
    this.cacheList = [];
  }
  add(promiseCreator) {
    return new Promise((resolve) => {
      if (this.taskNum < 2) {
        this.taskNum++;

        promiseCreator().then((res) => {
          resolve(res);
          this.taskNum--;
          this.clearCache();
        });
      } else {
        this.cacheList.push({ cb: promiseCreator, resolve });
        // this.cacheList.unshift({ cb: promiseCreator, resolve });
      }
    });
  }

  clearCache() {
    if (this.cacheList.length > 0) {
      const { cb, resolve } = this.cacheList[0];
      this.cacheList.splice(0, 1);
      cb().then((res) => {
        resolve(res);
        this.taskNum--;
        this.clearCache();
      });

      // for (let i = this.cacheList.length - 1; i >= 0; i--) {
      //   this.taskNum++;
      //   const { cb, resolve } = this.cacheList[i];
      //   cb().then((res) => {
      //     resolve(res);
      //     this.taskNum--;
      //     this.cacheList.splice(i, 1);
      //     this.clearCache();
      //   });

      //   if (this.taskNum === 2) break;
      // }
    }
  }
}

const timeout = (time) =>
  new Promise((resolve) => {
    setTimeout(resolve, time);
  });

const scheduler = new Scheduler();

const addTask = (time, order) => {
  scheduler
    .add(() => timeout(time))

    .then(() => console.log(order));
};

addTask(1000, "1");

addTask(500, "2");

addTask(300, "3");

addTask(400, "4");
```