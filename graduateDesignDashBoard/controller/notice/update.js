const mysql = require('../../mysql');
const Sequelize = require('sequelize');

module.exports = async (ctx, next) => {

  let id = ctx.request.body.id
  let title = ctx.request.body.title;
  let content = ctx.request.body.content;

  let notices = await mysql.Notice.update({
    id: id,
    title: title,
    content: content
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