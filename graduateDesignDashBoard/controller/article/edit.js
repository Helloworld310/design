const mysql = require('../../mysql');
const Sequelize = require('sequelize');

module.exports = async (ctx, next) => {

  let title = ctx.request.body.title;
  let description = ctx.request.body.description;
  let time = ctx.request.body.time;
  let content = ctx.request.body.content;
  let img = ctx.request.body.img;

  var articles = await mysql.Article.findAll({
    where: {
      status: 'edit'
    }
  });
  ctx.body = {
    code: 0,
    msg: 'success',
    data: articles
  }
}