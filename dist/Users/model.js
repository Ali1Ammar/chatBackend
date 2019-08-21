var mongoose = require('../../bin/dbMongo');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: String,
  urlimg: String,
  follows: [Schema.Types.ObjectId]

});

module.exports = mongoose.model('Users', UserSchema);