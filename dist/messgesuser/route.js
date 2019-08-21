var express = require('express');
var router = express.Router();
var msgCont = require('./controller');
/* GET users listing. */
// router.get('/', function (req, res, next) {
//     res.render('User');
// });
router.get('/all', async function (req, res, next) {
    console.log("Get Msg");
    let linkedID = msgCont.generateLinkedId(req.query.myid, req.query.otherid);
    console.log(linkedID);
    var msgs = await msgCont.getMsg(linkedID);
    res.json(msgs);
});
// router.post('/', async function (req, res) {
//     console.log("POst Msg");
//     let linkedID = generateLinkedId(req.param.myid, req.param.otherid)
//     let id = await msgCont.addMsg(
//         {
//             linkedTwoUserID : linkedID,
//             data : req.post,
//             urlMedia : String ,
//         }
//     )
//     console.log(id);
//     var token = jwt.sign({ "id": id }, 'secret', { expiresIn: '1h' }, { algorithm: 'RS256' });
//     var users = await UserCont.findUserAll()
//     console.log(users)
//     res.redirect('/bootChat?token=' + token + '&id=' + id + "&users=" + JSON.stringify(users))

// })


//
module.exports = router;