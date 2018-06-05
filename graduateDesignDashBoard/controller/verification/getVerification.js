'use strict'
const captchapng = require('captchapng');
const crypt = require('../../crypt');
const utils = require('utility');
const key = utils.sha1('chat-captcha');

module.exports = async (ctx, next) => {
    const value = parseInt(Math.random()*9000 + 1000);
    const p = new captchapng(120, 30, value);
    p.color(0, 0, 0, 0);
    p.color(80, 80, 80, 255);
    let img = p.getBase64();
    let imgUrl = new Buffer(img, 'base64');
    let verificationKey = crypt.encrypt(key, value.toString());
    ctx.body = {
        code: 0,
        data: {
          verificationPng: img,
          verificationKey: verificationKey
        }
    }
}