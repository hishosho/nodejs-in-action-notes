const User = require('../models/user');

exports.form = (req, res) => {
  res.render('register', { title: 'Register' });
};

exports.submit = (req, res, next) => {
  var data = req.body.user;
  console.log('User:', req.body.user);
  // 检查用户名是否唯一
  User.getByName(data.name, (err, user) => {
    if (err) return next(err);

    // 用户名已经被占用
    if (user.id) {
      res.error('Username already taken!');
      res.redirect('back');
    } else {
      // POST请求创建用户
      user = new User({ name: data.name, pass: data.pass });
      // 保存新用户
      user.save((err) => {
        if (err) return next(err);
        // 为认证保存uid
        req.session.uid = user.id;
        // 重定向到记录的列表页
        res.redirect('/')
      });
    }
  });
};