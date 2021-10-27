const redis = require('redis')
const bcrypt = require('bcrypt')
const db = redis.createClient()

class User {
  constructor (obj) {
    for (const key in obj) {
      this[key] = obj[key]
    }
  }
  static getByName (name, cb) {
    // 根据名称查找用户ID
    User.getId(name, (err, id) => {
      if (err) return cb(err)
      // 用ID抓取用户
      User.get(id, cb)
    })
  }
  static authenticate (name, pass, cb) {
    // 通过用户名查找用户
    User.getByName(name, (err, user) => {
      if (err) return cb(err)
      // 用户不存在
      if (!user.id) return cb()
      // 对给出的密码做哈希处理
      bcrypt.hash(pass, user.salt, (err, hash) => {
        if (err) return cb(err)
        // 匹配发现项
        if (hash === this.pass) return cb(null, user)
        // 密码无效
        cb()
      })
    })
  }
  save (cb) {
    // 如果设置了id，则用户已存在
    if (this.id) {
      this.update()
    } else {
      // 创建唯一ID
      db.incr('user:ids', (err, id) => {
        if (err) return cb(err)
        this.id = id
        // 密码hash
        this.hashPassword((err) => {
          if (err) return cb(err)
          // 保存用户属性
          this.update(cb)
        })
      })
    }
  }
  update (cb) {
    const id = this.id
    // 用名称索引用户ID
    db.set(`user:id:${this.name}`, id, (err) => {
      if (err) return cb(err)
      // 用redis存储当前类的属性
      db.hmset(`user:${id}`, this, (err) => {
        cb(err)
      })
    })
  }
  hashPassword (cb) {
    // 生成有12个字符的盐
    bcrypt.genSalt(12, (err, salt) => {
      if (err) return cb(err)
      this.salt = salt
      // 生成hash
      bcrypt.hash(this.pass, salt, (err, hash) => {
        if (err) return cb(err)
        // 设成hash以便保存
        this.pass = hash
        cb()
      })
    })
  }
}

module.exports = User