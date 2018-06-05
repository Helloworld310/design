const mysql = require('../../mysql');
const Sequelize = require('sequelize');

module.exports = async (ctx, next) => {

  if (ctx.request.body.id) {
    let id = ctx.request.body.id;

    await mysql.Article.update({
      status: 'hasPrePush'
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
    let description = ctx.request.body.description;
    let time = ctx.request.body.time;
    let content = ctx.request.body.content;
    let img = ctx.request.body.img;

    var articles = await mysql.Article.findAll({
      where: {
        status: 'edit'
      }
    });
    if (articles.length === 0) {
      await mysql.Article.create({
        title: title,
        description: description,
        content: content,
        status: 'edit',
        time: time,
        img: img
      });
    } else {
      await mysql.Article.update({
        title: title,
        description: description,
        content: content,
        status: 'edit',
        time: time,
        img: img
      }, {
        where: {
          status: 'edit'
        }
      });
    }

    await mysql.Article.create({
      title: title,
      description: description,
      content: content,
      status: 'hasPrePush',
      time: time,
      img: img
    });
    ctx.body = {
      code: 0,
      msg: 'success'
    }
  }
}