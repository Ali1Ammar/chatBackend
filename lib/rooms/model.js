var mongoose = require('../../bin/dbMongo');
var Schema = mongoose.Schema;

var RoomSchema = new Schema({
  members : Array,
});


module.exports  = mongoose.model('room', RoomSchema);