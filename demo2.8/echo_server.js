const net = require('net')
const server = net.createServer(socket => {
  socket.on('data', data => {
    socket.write(data)
  })
  // 事件只被处理一次
  // socket.onec('data', data => {
  //   socket.write(data)
  // })
})

server.listen(8888)