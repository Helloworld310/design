const mysql = require('../../mysql');
const Sequelize = require('sequelize');

module.exports = async (ctx, next) => {

  let isNew = ctx.request.body.isNew

  let albums = await mysql.Album.findAll({
    attributes: ['id', 'title', 'avatar', 'time', 'status'],
    where: {
      status: 'hasPush'
    }
  });

  if (isNew) {
    ctx.body = {
      code: 0,
      msg: 'success',
      data: {
        albums: albums.reverse().splice(0, 3)
      }
    }
  } else {
    ctx.body = {
      code: 0,
      msg: 'success',
      data: {
        albums: albums.reverse()
      }
    }
  }
}