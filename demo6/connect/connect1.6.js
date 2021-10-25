const connect = require('connect')

const env = process.env.NODE_ENV || 'development'
function errorHandler (err, req, res, next) {
  res.statusCode = 500
  switch (env) {
    case 'development':
      console.error('Error:')
      console.error(err)
      res.setHeader('Content-Type', 'applocation/json')
      res.end(JSON.stringify(err))
      break
    default:
      res.end('Server error')
  }
}
function hello (req, res) {
  res.setHeader('Content-Type', 'text/plain')
  res.end('hello world')
  next()
}
connect()
  .use(hello)
  // hello方法里为定义next，调用时报错。程序就会调用到errorHandler中间件输出错误信息
  .use(errorHandler)
  .listen(3000)