const mysql = require('../../mysql');
const Sequelize = require('sequelize');

module.exports = async (ctx, next) => {

  var notices = await mysql.Notice.findAll({
    where: {
      status: 'edit'
    }
  });
  ctx.body = {
    code: 0,
    msg: 'success',
    data: notices[0]
  }
}