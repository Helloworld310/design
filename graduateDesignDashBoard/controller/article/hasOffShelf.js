const mysql = require('../../mysql');
const Sequelize = require('sequelize');

module.exports = async (ctx, next) => {

  let query = ctx.request.body.query

  let articles = await mysql.Article.findAll({
    attributes: ['id', 'title', 'description', 'time', 'img', 'status'],
    where: {
      status: 'offShelf'
    }
  });

  let num = (query.currentPage - 1) * query.pageSize
  let total = articles.length
  let arr = []
  if (total < query.pageSize) {
      arr = articles.reverse()
  } else {
      arr = articles.reverse().splice(num, query.pageSize)
  }

  ctx.body = {
    code: 0,
    msg: 'success',
    data: {
      articles: arr,
      total: total
    }
  }
}