const router = require('koa-router')();

const controller = require('../controller');

const article = require('koa-router')();
article
    .get('/edit', controller.article.edit)
    .post('/hasPrePush', controller.article.hasPrePush)
    .post('/hasDel', controller.article.hasDel)
    .post('/hasOffShelf', controller.article.hasOffShelf)
    .post('/hasPush', controller.article.hasPush)
    .post('/search', controller.article.search)
    .post('/save', controller.article.save)
    .post('/del', controller.article.del)
    .post('/reEdit', controller.article.reEdit)
    .post('/detail', controller.article.detail)
    .post('/prePush', controller.article.prePush)
    .post('/offShelf', controller.article.offShelf)
    .post('/recovery', controller.article.recovery)
    .post('/push', controller.article.push)
    .post('/destroy', controller.article.destroy)

const login = require('koa-router')();
login
    .post('/signin', controller.login.signin)

const verification = require('koa-router')();
verification
    .get('/getVerification', controller.verification.getVerification)
    .post('/getVerificationStatus', controller.verification.getVerificationStatus)

const koaBody = require('koa-body')({
    multipart: true,  // 允许上传多个文件
    formidable: { 
    uploadDir: '/data/designImg',// 上传的文件存储的路径 
    keepExtensions: true  //  保存图片的扩展名
 }
});
const photo = require('koa-router')();
photo
    .get('/getImg', controller.photo.getImg)
    .post('/saveImg', koaBody, controller.photo.saveImg)
    .post('/delImg', controller.photo.delImg)

const notice = require('koa-router')();
notice
    .get('/edit', controller.notice.edit)
    .post('/hasPush', controller.notice.hasPush)
    .post('/save', controller.notice.save)
    .post('/push', controller.notice.push)
    .post('/update', controller.notice.update)

const album = require('koa-router')();
album
    .get('/list', controller.album.edit)
    .post('/pictures', controller.album.list)
    .post('/save', controller.album.save)
    .post('/push', controller.album.push)
    .post('/detail', controller.album.detail)
    .post('/reEdit', controller.album.reEdit)
    .post('/saveReEdit', controller.album.saveReEdit)
    .post('/del', controller.album.del)

const stats = require('koa-router')();
stats
    .get('/totalNum', controller.stats.totalNum)

router.use('/article', article.routes());
router.use('/login', login.routes());
router.use('/photo', photo.routes());
router.use('/verification', verification.routes());
router.use('/notice', notice.routes());
router.use('/album', album.routes())
router.use('/stats', stats.routes())

module.exports = router;