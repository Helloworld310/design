const crypto = require('crypto');
const mysql = require('../../mysql');
const Sequelize = require('sequelize');

module.exports = async (ctx, next) => {
  let account = ctx.request.body.account;
  let password = ctx.request.body.password;

  const hash = crypto.createHash('md5');
  hash.update(password);
  let hashPassword = hash.digest('hex')

  let user = await mysql.User.findAll({
    where: {
      account: account
    }
  });
  if (user && user.length === 1 &&user[0].password === hashPassword) {
    var time = new Date().getTime();
    var expiresTime = new Date(time + 1000*60*60);
    ctx.cookies.set('session', 'test', {
      expires: expiresTime
    });
    ctx.body = {
      code: 0,
      msg: 'success'
    }
  } else {
    ctx.body = {
      code: 1,
      msg: 'account not found or password error'
    }
  }
}