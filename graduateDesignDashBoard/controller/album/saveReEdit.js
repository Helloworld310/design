const mysql = require('../../mysql');
const Sequelize = require('sequelize');

module.exports = async (ctx, next) => {

  let id = ctx.request.body.id
  let title = ctx.request.body.title;
  let avatar = ctx.request.body.avatar;
  let time = ctx.request.body.time;
  let pictures = ctx.request.body.pictures;

  let albums = await mysql.Album.update({
    id: id,
    title: title,
    avatar: avatar,
    time: time,
    pictures: JSON.stringify(pictures)
  }, {
    where: {
      id: id
    }
  });
  ctx.body = {
    code: 0,
    msg: 'success'
  }
}