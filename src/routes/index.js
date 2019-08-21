var createError = require('http-errors') 
var express = require('express');
var router = express.Router();
var usersRouter = require('../Users/route');
var msgUsersRouter = require('../messgesuser/route');
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express ' });
});
router.get('/bootChat', function(req, res) {
//  console.log(req.query.users)
console.log(req.query)
  res.render('bootChat',req.query);
});    
 

// router.use('/chat', (req,res)=>{ 
  
//   res.render('chat', { token: req.query.token ,title : "CHat PAge",id : req.query.id});
// });


router.use('/users', usersRouter);
router.use('/msguser', msgUsersRouter);
// catch 404 and forward to error handler
router.use(function(req, res, next) {
  next(createError(404));
});
module.exports = router;
