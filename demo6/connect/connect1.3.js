const connect = require('connect')
function logger (req, res, next) {
  console.log('%s %s', req.method, req.url)
  next()
}
function hello (req, res) {
  res.setHeader('Content-Type', 'text/plain')
  res.end('hello world')
}
connect()
  .use(logger)
  // 如果hello在前面，将不会调用logger中间件，因为没有执行next()
  .use(hello)
  .listen(3000)