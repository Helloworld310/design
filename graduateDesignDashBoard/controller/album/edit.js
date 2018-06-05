const mysql = require('../../mysql');
const Sequelize = require('sequelize');

module.exports = async (ctx, next) => {

  let title = ctx.request.body.title;
  let avatar = ctx.request.body.avatar;
  let time = ctx.request.body.time;
  let pictures = ctx.request.body.pictures;

  var albums = await mysql.Album.findAll({
    where: {
      status: 'edit'
    }
  });
  ctx.body = {
    code: 0,
    msg: 'success',
    data: albums[0]
  }
}