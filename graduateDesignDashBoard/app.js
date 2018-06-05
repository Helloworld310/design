const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const router = require('./router')

const app = new Koa();

app.use(async (ctx, next) => {
    await next();
})

app.use(cors({
    credentials: true
}));
const koaBody = require('koa-body');
app.use(koaBody());
app.use(bodyParser());
app.use(router.routes());

app.listen(3001, console.log('serve is listening at 3001...'));
