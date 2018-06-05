const crypt = require('../../crypt');
const utils = require('utility');
const key = utils.sha1('chat-captcha');

module.exports = async (ctx, next) => {
  const verification = ctx.request.body.verification;
  const verificationKey = ctx.request.body.verificationKey;

  if (verification === crypt.decrypt(key, verificationKey)) {
    ctx.body = {
      code: 0,
      msg: 'success'
    }
  } else {
    ctx.body = {
      code: 1,
      msg: 'fail'
    }
  }
}
