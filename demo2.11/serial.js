const async = require('async')

// 用回调让任务顺序执行。
// 用setTimeout模拟需要花时间执行的任务：
// 第一个任务用一秒是，第二个用半秒，最后一个用十分之一秒。
// 缺点：代码可读性差
setTimeout(() => {
  console.log('I execute first.')
  setTimeout(() => {
    console.log('I execute next.')
    setTimeout(() => {
      console.log('I execute last.')
    }, 100)
  }, 500)
}, 1000)

// 用社区贡献的工具实现串行化控制，提高可读性和可维护性
async.series([
  callback => {
    setTimeout(() => {
      console.log('I execute first.')
      callback()
    }, 1000)
  },
  callback => {
    setTimeout(() => {
      console.log('I execute next.')
      callback()
    }, 500)
  },
  callback => {
    setTimeout(() => {
      console.log('I execute last.')
      callback()
    }, 100)
  }
])