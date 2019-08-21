let msgUserCont = require("./messgesuser/controller");
let userCont = require("./Users/controller")
module.exports = function (server) {
  let Socket = require("socket.io");
  Socket.prototype.onclose = function (reason) {
    this.emit('disconnecting', reason); //<--insert the new event here
    this.leaveAll();
    this.emit('disconnect', reason);
  };
  let io = Socket(server)
  var socketioJwt = require("socketio-jwt");
  io.use(socketioJwt.authorize({
    secret: 'secret',
    handshake: true,
    callback: 15000
  }));

  io.on("connect", function (socket) {
    var mongoID = socket.decoded_token.id;
    socket.join(mongoID, () => {
      console.log("join room")
      io.sockets.adapter.rooms[mongoID].follows = new Set()
      userCont.getFollowById(mongoID, 0).then((data) => {
        io.sockets.adapter.rooms[mongoID].follows = data
        emitStatus(io, mongoID, true)
      })

    })


    console.log('connected hello! ', mongoID)
    socket.on("chatting", function (data) {
      console.log(data)
      isOnline(io, data.reciveid) ?
        socket.to(data.reciveid).to(mongoID).emit("reciverPeer", data)
        : socket.to(mongoID).emit("reciverPeer", data);
      msgUserCont.addMsg(
        data
      )
    });

    socket.on("follow", async function (otherid, name, callback) {
      console.log("FOLLOEW HERE")
      if (otherid) {
        callback(follow(io, otherid, mongoID)) // return isonline
      }
      else {
        let user = await userCont.findUserByName(name)
        callback(follow(io, user._id, mongoID), user)
      }
    });
    socket.on('disconnecting', function () {
        console.log("this id disconnecting : " + mongoID)
        emitStatus(io, mongoID, false)
      });

  


  });
  //use this io.sockets.clients[_your id here_]
  isOnline = (io, id) => {
    console.log(id)
    let room = io.sockets.adapter.rooms[id]
    //io.sockets.adapter.rooms[mongoID]
    console.log("is online " + room)
    console.log(room != undefined)
    return room != undefined;

  }

  // emitStatus my status not other
  emitStatus = (io, mongoID, isonline) => {
      let follows = io.sockets.adapter.rooms[mongoID].follows // get list of follows from when you save it 
      follows.forEach(element => {
        var eleID = element._id
        let status = io.sockets.adapter.rooms[eleID] != undefined; // true he online , false he offline
        if (status) {
          io.to(eleID).emit(isonline ? "online" : "offline", mongoID)
        }
          if (isonline && status ) {
            io.to(mongoID).emit(status ? "online" : "offline", eleID) // emit to me if this online or not
          }
      })
  }

  follow = (io, otherid, sendId) => {
    //console.log("HELLO FOLLOW FUNCTION")
    userCont.addFollow(sendId, otherid)
    try {
      io.sockets.adapter.rooms[otherid].follows.add(sendId);
      return true
    } catch (err) {
      return false
    }
    //  console.log(io.sockets.adapter.rooms[mongoID].follow)
  }
}

  /* SOME OLD CODE GOOOD BYEEEEEEEEEEEE
  
    // io.engine.generateId = function (req) {
    //   console.log("WE are in generated")
    //   urlParse = require("url").parse(req.url, true); //to parse url
    //   let token = urlParse.query.token;
    //   console.log(token);
    //   try {
    //     var decoded = jwt.verify(token, "secret", { algorithm: 'RS256' });
    //     console.log(decoded.id)
    //     return decoded.id;
    //   } catch (err) {
    //     console.log("some Errrrror in genetrated Id");
    //     console.log(err.toString().length)
    //     return err.toString();
    //   }
    // };
  
  // io.use(function(socket, next){
//   socket.id = socket.handshake.query.id  
//   next()
// })
  */


