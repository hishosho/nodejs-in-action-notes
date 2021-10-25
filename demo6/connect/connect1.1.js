const app = require('connect')()
app.use((req, res, next) => {
  res.end('hello world')
})
app.listen(3000)