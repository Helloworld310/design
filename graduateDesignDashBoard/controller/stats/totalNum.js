const mysql = require('../../mysql');
const Sequelize = require('sequelize');

module.exports = async (ctx, next) => {
  let articles = await mysql.Article.findAll({
    where: {
      status: 'hasPush'
    }
  })

  let notices = await mysql.Notice.findAll({
    where: {
      status: 'hasPush'
    }
  })

  let albums = await mysql.Album.findAll({
    where: {
      status: 'hasPush'
    }
  })

  ctx.body = {
    code: 0,
    data: {
      articles: articles.length,
      notices: notices.length,
      albums: albums.length
    }
  }
}
