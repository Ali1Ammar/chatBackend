//@flow
var mongoose = require('../../bin/dbMongo');
var Schema = mongoose.Schema;

var MsgSchema = new Schema({
    data : String,
    urlMedia : String ,
    linkedTwoUserID : String,
    sentid : Schema.Types.ObjectId,
    reciveid : Schema.Types.ObjectId
});

MsgSchema.set('timestamps', true); 


module.exports  = mongoose.model('messegeUser', MsgSchema);