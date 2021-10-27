const User = require('../models/user');
module.exports = (req, res, next) => {
  // 从会话中取出已登陆用户的ID
  const uid = req.session.uid
  if (!uid) return next()
  // 从Redis中取出已登录用户的数据
  User.get(uid, (err, user) => {
    if (err) return next(err);
    // 将用户数据输出到响应对象中
    req.user = res.locals.user = user;
    next();
  }) 
}