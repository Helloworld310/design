const mysql = require('../../mysql');
const Sequelize = require('sequelize');

module.exports = async (ctx, next) => {

  let title = ctx.request.body.title;
  let time = ctx.request.body.time;
  let content = ctx.request.body.content;

  var notices = await mysql.Notice.findAll({
    where: {
      status: 'edit'
    }
  });
  if (notices.length === 0) {
    await mysql.Notice.create({
      title: title,
      content: content,
      status: 'edit',
      time: time
    });
  } else {
    await mysql.Notice.update({
      title: title,
      content: content,
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