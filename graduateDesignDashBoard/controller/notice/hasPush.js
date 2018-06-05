const mysql = require('../../mysql');
const Sequelize = require('sequelize');

module.exports = async (ctx, next) => {

  let query = ctx.request.body

  let notices = await mysql.Notice.findAll({
    where: {
      status: 'hasPush'
    }
  });

  let num = (query.currentPage - 1) * query.pageSize
  let total = notices.length
  let arr = []
  if (total < query.pageSize) {
      arr = notices.reverse()
  } else {
      arr = notices.reverse().splice(num, query.pageSize)
  }

  ctx.body = {
    code: 0,
    msg: 'success',
    data: {
      notices: arr,
      total: total
    }
  }
}