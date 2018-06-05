const mysql = require('../../mysql');
const Sequelize = require('sequelize');

module.exports = async (ctx, next) => {

  let title = ctx.request.body.title;
  let time = ctx.request.body.time;
  let avatar = ctx.request.body.avatar;
  let pictures = ctx.request.body.pictures;

  var albums = await mysql.Album.findAll({
    where: {
      status: 'edit'
    }
  });
  if (albums.length === 0) {
    await mysql.Album.create({
      title: title,
      avatar: avatar,
      pictures: JSON.stringify(pictures),
      status: 'edit',
      time: time
    });
  } else {
    await mysql.Album.update({
      title: title,
      avatar: avatar,
      pictures: JSON.stringify(pictures),
      status: 'edit',
      time: time
    }, {
      where: {
        status: 'edit'
      }
    });
  }
  ctx.body = {
    code: 0,
    msg: 'success'
  }
}