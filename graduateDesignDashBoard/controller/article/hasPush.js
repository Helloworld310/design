const mysql = require('../../mysql');
const Sequelize = require('sequelize');

module.exports = async (ctx, next) => {

  let isNew = ctx.request.body.isNew
  let query = ctx.request.body.query

  let articles = await mysql.Article.findAll({
    attributes: ['id', 'title', 'description', 'time', 'img', 'status'],
    where: {
      status: 'hasPush'
    }
  });

  if (isNew) {
    ctx.body = {
      code: 0,
      msg: 'success',
      data: articles.reverse().splice(0, 5)
    }
  } else {
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
}