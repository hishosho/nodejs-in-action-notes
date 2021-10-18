const events = require('events')
const net = require('net')

const channel = new events.EventEmitter()
channel.clients = {}
channel.subscriptions = {}
channel.on('join', function (id, client) {
  this.client[id] = client
  this.subscriptions[id] = (senderId, message) => {
    if (id !== senderId) {
      this.client[id].write(message)
      // 获取broadcast事件总数
      this.client[id].write(`Guests online: ${this.listeners('broadcast').length}`)
    }
  }
  this.on('broadcast', this.subscriptions[id])
})

channel.on('leave', function (id) {
  channel.removeListener('broadcast', this.subscriptions[id])
  channel.emit('broadcast', id, `${id} has left the chatroom. \n`)
})

channel.on('shutdown', () => {
  channel.emit('broadcast', '', 'The server has shut down. \n')
  // 删除所有broadcast事件
  channel.removeAllListeners('broadcast')
})

const server = net.createServer(client => {
  const id = `${client.remoteAddress}:${client.remotePort}`
  channel.emit('join', id, client)
  // 监听数据传输
  client.on('data', data => {
    data = data.toString()
    // 添加停止聊天服务命令
    if (data === 'shutdown\r\n') {
      channel.emit('shutdown')
    }
    channel.emit('broadcast', id, data)
  })

  // 监听服务关闭 
  client.on('close', () => {
    channel.emit('leave')
  })

})
server.listen(8888)

// 设置最多多少个事件
// channel.setMaxListeners(50);
