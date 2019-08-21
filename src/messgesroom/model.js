//@flow
var mongoose = require('../../bin/dbMongo');
var Schema = mongoose.Schema;

var MsgSchema = new Schema({
    data : String,
    urlMedia : String ,
    room : Schema.Types.ObjectId
});

MsgSchema.set('timestamps', true); 


module.exports  = mongoose.model('messegeRoom', MsgSchema);