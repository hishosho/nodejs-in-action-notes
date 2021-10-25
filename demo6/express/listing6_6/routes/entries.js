const Entry = require('../models/entry')

exports.form = (req, res) => {
  res.render('post', { title: 'Post' });
};

exports.submit = (req, res, next) => {
  // 来自表单中名为"entry[...]"的控件
  const data = req.body.entry
  const user = res.locals.user
  const username = user ? user.name : null
  const entry = new Entry({
    username: username,
    title: data.title,
    body: data.body
  })
  entry.save((err) => {
    if (err) return next(err)
    res.redirect('/')
  })
}

exports.list = (req, res, next) => {
  // 获取消息
  Entry.getRange(0, -1, (err, entries) => {
    if (err) return next(err)
    // 渲染HTTP响应
    res.render('entries', {
      title: 'Entries',
      entries: entries
    })
  })
}

