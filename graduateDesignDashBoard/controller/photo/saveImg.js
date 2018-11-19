const mysql = require('../../mysql');
const Sequelize = require('sequelize');

module.exports = async (ctx, next) => {
    let file = ctx.request.body.files.file
    let imgName = file.path.substring(file.path.lastIndexOf('/') + 1) 
    let imgPath = 'http://luojc.cn/designImg/' + imgName

    
    await mysql.Photo.create({
        img: imgPath,
        status: 'hasPush'
    });

    ctx.body = {
        code: 0,
        image_url: imgPath
    }
}