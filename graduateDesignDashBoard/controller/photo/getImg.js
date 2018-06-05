const mysql = require('../../mysql');
const Sequelize = require('sequelize');

module.exports = async (ctx, next) => {
  let photos = await mysql.Photo.findAll({
    where: {
      status: 'hasPush'
    }
  });
  ctx.body = {
    code: 0,
    data: photos
  }
}
