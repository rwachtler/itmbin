var crypto = require('crypto');

ItmBin = function () {

}

ItmBin.prototype.getAuthKey = function () {
  return crypto.randomBytes(20).toString('hex');
}

module.exports.ItmBin = ItmBin
