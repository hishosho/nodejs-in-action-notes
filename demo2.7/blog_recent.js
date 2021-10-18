const http = require('http')
const fs = require('fs')

http.createServer((req, res) => {
  if (req.url === '/') {
    // 这里的路径是相对根文件的路径，不是当前文件的相对路径
    fs.readFile('./demo2.7/titles.json', (err, data) => {
      if (err) {
        console.log(err)
        res.end('Server Error: read titles error')
      } else {
        const titles = JSON.parse(data.toString())
        // 这里的路径是相对根文件的路径，不是当前文件的相对路径
        fs.readFile('./demo2.7/template.html', (err, data) => {
          if (err) {
            console.log('Server Error: read template error')
            res.end('Server Error')
          } else {
            const temp1 = data.toString()
            const html = temp1.replace('%', titles.join('</li></li>'))
            res.writeHead(200, { 'Content-Type': 'text/html' })
            res.end(html)
          }
        })
      }
    })
  }
}).listen(8000, '127.0.0.1')