const mysql = require('../../mysql');
const Sequelize = require('sequelize');

module.exports = async (ctx, next) => {

  let id = ctx.request.body.id
  let title = ctx.request.body.title;
  let description = ctx.request.body.description;
  let time = ctx.request.body.time;
  let content = ctx.request.body.content;
  let img = ctx.request.body.img;
  let status = ctx.request.body.status;

  let articles = await mysql.Article.update({
    id: id,
    title: title,
    description: description,
    time: time,
    content: content,
    status: status,
    img: img
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