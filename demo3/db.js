const sqlite3 = require('sqlite3').verbose()
const dbName = 'later.sqlite'
// 连接到一个数据库文件
const db = new sqlite3.Database(dbName)

db.serialize(() => {
  const sql = `
    CREATE TABLE IF NOT EXISTS articles
      (id integer primary key, title, content TEXT)
  `
  // 如果还没有，创建一个“article”表
  db.run(sql)
})

class Article {
  // 获取所有文章
  static all (cb) {
    db.all('SELECT * FROM articles', cb)
  }
  // 选择一篇指定的文章
  static find (id, cb) {
    db.get('SELECT * FROM articles WHERE id = ?', id, cb)
  }
  // 插入一篇文章
  static create(data, cb) {
    const sql = 'INSERT INTO articles(title, content) VALUES (?, ?)'
    db.run(sql, data.title, data.content, cb)
  }
  // 删除某篇文章
  static delete (id, cb) {
    if (!id) return cb(new Error('Please provide an id'))
    db.run('DELETE FROM articles WHERE id = ?', id, cb)
  }
}

module.exports = db
module.exports.Article= Article