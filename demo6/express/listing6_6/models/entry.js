const redis = require('redis')
// 创建Redis客户端实例
const db = redis.createClient()

class Entry {
  constructor (obj) {
    // 循环遍历传入对象中的键
    for (const key in obj) {
      this[key] = obj[key]
    }
  }

  static getRange (from, to, cb) {
    // 用来获取消息记录的Redis lrange函数
    db.lrange('entries', from, to, (err, items) => {
      if (err) return cb(err)
      let entries = []
      items.forEach(item => {
        // 解码之前保存为JSON的消息记录
        entries.push(JSON.parse(item))
      })
      cb(null, entries)
    })
  }

  save (cb) {
    // 将保存的消息转为JSON字符串
    const entryJSON = JSON.stringify(this)
    // 将JSON字符串保存到Redis列表中
    db.lpush(
      'entries',
      entryJSON,
      (err) => {
        if (err) return cb(err)
        cb()
      }
    )
  }
}

module.exports = Entry