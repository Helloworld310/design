const crypto = require('crypto');

const encrypt = function(key, data) {
    var cipher = crypto.createCipher('aes-128-cbc', key);
    var crypted = cipher.update(data, 'utf8', 'binary');
    crypted += cipher.final('binary');
    crypted = new Buffer(crypted, 'binary').toString('base64');
    return crypted;
};

const decrypt = function(key, crypted) {
    crypted = new Buffer(crypted, 'base64').toString('binary');
    var decipher = crypto.createDecipher('aes-128-cbc', key);
    var decoded = decipher.update(crypted, 'binary', 'utf8');
    decoded += decipher.final('utf8');
    return decoded;
};

module.exports = {
    encrypt: encrypt,
    decrypt: decrypt
}