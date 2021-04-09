const fn1 = (... args)=>console.log('I want sleep1', ... args)
const fn2 = (... args)=>console.log('I want sleep2', ... args)

function Events () {
  this.tasks = []
  this.onceTasks = []
}

Events.prototype = {
  on: function () {
    const eventName = arguments[0]
    const fn = arguments[1]
    const params = [...arguments].slice(2)

    if (eventName === 'sleep') {
      this.tasks.push({fn, params})
    }
  },
  fire: function () {
    const eventName = arguments[0]
    const params = [...arguments].slice(1)

    if (eventName === 'sleep') {
      this.tasks.forEach((task, index) => {
        task.fn([...task.params, ...params].join(' '))

        if (index === this.tasks.length - 1 && this.onceTasks.length > 0) {
          this.onceTasks.forEach(onceTask => onceTask.fn())

          this.onceTasks = []
        }
      })
    }
  },
  off: function () {
    const eventName = arguments[0]

    if (eventName === 'sleep') {
      const fn = arguments[1]
      const index = this.tasks.findIndex(task => task.fn === fn)
      if (index > -1) this.tasks.splice(index, 1)
    }
  },
  once: function () {
    const eventName = arguments[0]
    if (eventName === 'sleep') {
      this.onceTasks.push({fn: arguments[1]})
    }
  }
}

const event = new Events();

event.on('sleep', fn1, 1, 2, 3);
event.on('sleep', fn2, 1, 2, 3);
event.fire('sleep', 4, 5, 6);
event.off('sleep', fn1);
event.once('sleep', () => console.log('I want sleep'));
event.fire('sleep');
event.fire('sleep');
