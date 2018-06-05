const mysql = require('../../mysql');
const Sequelize = require('sequelize');

module.exports = async (ctx, next) => {

  let id = ctx.request.body.id;

  let pictures = await mysql.Album.findAll({
    attributes: ['id', 'title', 'avatar', 'time', 'status', 'pictures'],
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