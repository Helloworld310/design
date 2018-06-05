const mysql = require('../../mysql');
const Sequelize = require('sequelize');

module.exports = async (ctx, next) => {

  let id = ctx.request.body.id;

  let articles = await mysql.Article.findAll({
    attributes: ['id', 'title', 'description', 'img', 'content'],
    where: {
      id: id
    }
  });
  ctx.body = {
    code: 0,
    msg: 'success',
    data: articles
  }
}