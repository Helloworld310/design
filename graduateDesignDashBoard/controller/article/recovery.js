const mysql = require('../../mysql');
const Sequelize = require('sequelize');

module.exports = async (ctx, next) => {

  let id = ctx.request.body.id;

  await mysql.Article.update({
    status: 'hasPrePush'
  }, {
    where: {
      id: id
    }
  });

  ctx.body = {
    code: 0,
    msg: 'success'
  }
}