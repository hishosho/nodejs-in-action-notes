const http = require('http')
const fs = require('fs')

http.createServer((req, res) => {
  if (req.url === '/') {
    getTitles(res)
  }
}).listen(8000, '127.0.0.1')

function getTitles (res) {
  // 这里的路径是相对根文件的路径，不是当前文件的相对路径
  fs.readFile('./demo2.7/titles.json', (err, data) => {
    if (err) {
      handleError(err, res)
    } else {
      getTemplate(JSON.parse(data.toString()), res)
    }
  })
}

function getTemplate (titles, res) {
  // 这里的路径是相对根文件的路径，不是当前文件的相对路径
  fs.readFile('./demo2.7/template.html', (err, data) => {
    if (err) {
      handleError(err, res)
    } else {
      const temp1 = data.toString()
      const html = temp1.replace('%', titles.join('</li></li>'))
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end(html)
    }
  })
}

function handleError (err, res) {
  console.error(err)
  res.end('Server Error')
}