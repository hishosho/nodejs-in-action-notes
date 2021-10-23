const express = require('express')
const app = express()
const articles = [ { article: 'Example' } ]
// 消息体解析器处理post请求
const bodyParser = require('body-parser')
// 加载数据库模块
const Article = require('./db').Article
const read = require('node-readability')
app.set('port', process.env.PORT || 3000)

app.get('/articles', (req, res, next) => {
  // 获取静态数据换成获取数据库中的数据
  // res.send(articles)
  Article.all((err, articles) => {
    if (err) return next(err)
    // 浏览器访问可以让数据以html的方式返回，利用ejs模版生成html.
    // 命令行就直接返回json数据
    res.format({
      html: () => {
        res.render('articles.ejs', { articles: articles })
      },
      json: () => {
        res.send(articles)
      }
    })
  })
})

// 支持编码为JSON的请求消息体
app.use(bodyParser.json())
// 支持编码为表单的请求消息体
app.use(bodyParser.urlencoded({ extended: true }))

app.use(
  '/css/bootsrtap.css',
  express.static('node_modules/bootstrap/dist/css/bootstrap.css')
)

// 执行命令调用创建文章请求：curl --data "url=http://manning.com/cantelon2/" http://localhost:3000/articles
// 从http://manning.com/cantelon2/中读取需要插入的文章内容进行数据录入
app.post('/articles', (req, res, next) => {
  const url = req.body.url
  read(url, (err, result) => {
    if (err || !result) res.status(500).send('Error downloading article')
    Article.create(
      { title: result.title,  content: result.content },
      (err, article) => {
        if (err) return next(err)
        res.send('ok')
      }
    )
  })
})

// 执行命令调用查询某篇文章请求：curl http://localhost:3000/articles/1
app.get('/articles/:id', (req, res, next) => {
  const id = req.params.id
  console.log('Fetching:', id)
  // res.send(articles[id])
  Article.find(id, (err, article) => {
    if (err) return next(err)
    res.send(article) 
  })
})

// 执行命令调用删除请求：curl -X DELETE http://localhost:3000/articles/1
app.delete('/articles/:id', (req, res, next) => {
  const id = req.params.id
  console.log('Deleting:', id)
  // delete articles[id]
  // res.send({ message: 'Deleted' })
  Article.delete(id, (err) => {
    if (err) return next(err)
    res.send({ message: 'Delete' })
  })
})

app.listen(app.get('port'), () => {
  console.log(`App started on port`, app.get('port'))
})

module.exports = app