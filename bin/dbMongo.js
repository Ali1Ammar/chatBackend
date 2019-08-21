var mongoose = require('mongoose');
var db = mongoose.connection;
mongoose.connect('mongodb://localhost/testsocket', {useNewUrlParser: true});
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
console.log("DB Connected")
});
module.exports = mongoose