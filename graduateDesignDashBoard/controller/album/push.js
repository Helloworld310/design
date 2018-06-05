const mysql = require('../../mysql');
const Sequelize = require('sequelize');

module.exports = async (ctx, next) => {

  if (ctx.request.body.id) {
    let id = ctx.request.body.id;

    await mysql.Album.update({
      status: 'hasPush'
    }, {
      where: {
        id: id
      }
    });
    ctx.body = {
      code: 0,
      msg: 'success'
    }
  } else {
    let title = ctx.request.body.title;
    let time = ctx.request.body.time;
    let avatar = ctx.request.body.avatar;
    let pictures = JSON.stringify(ctx.request.body.pictures);

    var albums = await mysql.Album.findAll({
      where: {
        status: 'edit'
      }
    });
    if (albums.length === 0) {
      await mysql.Album.create({
        title: title,
        avatar: avatar,
        pictures: pictures,
        status: 'edit',
        time: time
      });
    } else {
      await mysql.Album.update({
        title: title,
        avatar: avatar,
        pictures: pictures,
        status: 'edit',
        time: time
      }, {
        where: {
          status: 'edit'
        }
      });
    }

    await mysql.Album.create({
      title: title,
      avatar: avatar,
      pictures: pictures,
      status: 'hasPush',
      time: time
    });
    ctx.body = {
      code: 0,
      msg: 'success'
    }
  }
}