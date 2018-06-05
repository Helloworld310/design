const mysql = require('../../mysql');
const Sequelize = require('sequelize');

module.exports = async (ctx, next) => {

  let id = ctx.request.body.id;

  let pictures = await mysql.Album.findAll({
    attributes: ['pictures'],
    where: {
      id: id
    }
  });
  ctx.body = {
    code: 0,
    msg: 'success',
    data: pictures[0]
  }
}