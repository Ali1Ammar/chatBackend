var express = require('express');
var router = express.Router();
var UserCont = require('./controller')
var jwt = require('jsonwebtoken');
const querystring = require('querystring');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('User');
});
router.get('/all', async function (req, res, next) {
  var users = await UserCont.findUserAll()
  //console.log("GEt ")
  res.json(users);
  })
  router.get('/follow', async function (req, res, next) {
    var users = await UserCont.getFollowById(req.query.id,1)
    //console.log("GEt ")
    res.json(users);
    })
router.post('/', async function (req, res) { 
  console.log("POst User");

  let user = await UserCont.findOneOrCreate(req.body.name);
  //console.log(querystring.stringify(user.toObject()))
  let id = user.id
  //console.log(id)
  var token = jwt.sign({ "id": id }, 'secret', { expiresIn: '1h' }, { algorithm: 'RS256' });
 // var users = await UserCont.findUserAll()
 // console.log(users)
 
  res.redirect('/bootChat?token=' + token + '&name=' +user.name  + '&id=' + id)
})


//
module.exports = router;
