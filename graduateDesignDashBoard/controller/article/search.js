const mysql = require('../../mysql');
const Sequelize = require('sequelize');
const Op = Sequelize.Op

module.exports = async (ctx, next) => {

  let search = ctx.request.body.search;

  let articles = await mysql.Article.findAll({
    where: {
      status: 'hasPush',
      title: {
        [Op.like]: '%' + search + '%'
      }
    }
  });
  ctx.body = {
    code: 0,
    msg: 'success',
    data: articles.reverse()
  }
}