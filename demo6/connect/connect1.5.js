const connect = require('connect')

// setup函数可以用不同的配置调用多次
function setup (format) {
  // logger组件用正则表达式匹配请求属性
  const regexp = /:(\w+)/g
  // connect使用的真正的logger组件
  return function createLogger (req, res, next) {
    // 用正则表达式格式化请求的日志条目
    const str = format.replace(regexp, (match, property) => {
      return req[property]
    })
    // 将日志条目输出到控制台
    console.log(str)
    // 将控制权交给下一个中间件组件
    next()
  }
}
function hello (req, res) {
  res.setHeader('Content-Type', 'text/plain')
  res.end('hello world')
}
connect()
  .use(setup(':method :url'))
  .use(hello)
  .listen(3000)