# 如何实现一个 LazyMan?

```js
实现一个LazyMan，可以按照以下方式调用:
LazyMan(“Hank”)输出:
Hi! This is Hank!

LazyMan(“Hank”).sleep(10).eat(“dinner”)输出
Hi! This is Hank!
//等待10秒..
Wake up after 10
Eat dinner~

LazyMan(“Hank”).eat(“dinner”).eat(“supper”)输出
Hi This is Hank!
Eat dinner~
Eat supper~

LazyMan(“Hank”).sleepFirst(5).eat(“supper”)输出
//等待5秒
Wake up after 5
Hi This is Hank!
Eat supper
```

## 队列实现 (event loop)

```js
function _CodingMan(name) {
  this.tasks = []
  const self = this

  var fn = (function(name) {
    return function() {
      console.log(`Hi! This is ${name}!`)

      self.next()
    }
  })(name)

  this.tasks.push(fn)

  // 利用时间循环机制 在下一次循环启动任务
  setTimeout(() => {
    self.next()
  })
}

_CodingMan.prototype.next = function() {
  const fn = this.tasks.shift()

  fn && fn()
}

_CodingMan.prototype.sleep = function(time) {
  const self = this
  const fn = (function(time) {
    return function() {
      setTimeout(() => {
        self.next()
      }, time * 1000)
    }
  })(time)
  this.tasks.push(fn)

  return this
}

_CodingMan.prototype.eat = function(dinner) {
  const self = this
  const fn = (function(dinner) {
    return function() {
      console.log(`Eat ${dinner} ~`)
      self.next()
    }
  })(dinner)

  this.tasks.push(fn)

  return this
}

_CodingMan.prototype.firstSleep = function(time) {
  const self = this
  const fn = (function(time) {
    return function() {
      console.log('Wake up after ' + time + 's!')
      setTimeout(() => {
        self.next()
      }, time * 1000)
    }
  })(time)

  this.tasks.unshift(fn)

  return this
}

function CodingMan(name) {
  return new _CodingMan(name)
}
```

## Promise

```js
function _lazyMan(name) {
  this.orderPromise = this.newPromise()
  this.insertPromise = this.newPromise()

  this.order(function(resolve) {
    console.log('Name is ' + name)

    resolve()
  })
}

_lazyMan.prototype = {
  newPromise: function() {
    return new Promise((resolve) => {
      resolve()
    })
  },
  order: function(fn) {
    this.orderPromise = this.orderPromise.then(() => {
      return new Promise((resolve) => {
        this.first
          ? this.insertPromise.then(() => {
              fn(resolve)
            })
          : fn(resolve)
      })
    })
  },
  insert: function(fn) {
    this.first = true
    this.insertPromise = this.insertPromise.then(() => {
      return new Promise((resolve) => {
        fn(resolve)
        this.first = false
      })
    })
  },
  firstSleep: function(time) {
    this.insert(function(resolve) {
      console.log('firstSleep ' + time + 's!')
      setTimeout(() => {
        resolve()
      }, time * 1000)
    })

    return this
  },
  eat: function(name) {
    this.order(function(resolve) {
      console.log('Eat ' + name + ' ~')
      resolve()
    })

    return this
  },
  sleep: function(time) {
    this.order(function(resolve) {
      console.log('sleep ' + time + ' s!')
      setTimeout(() => {
        resolve()
      }, time * 1000)
    })

    return this
  },
}

function LazyMan(name) {
  return new _lazyMan(name)
}
```
