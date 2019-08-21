/* eslint-disable no-underscore-dangle */
const Socket = require('socket.io');
const socketioJwt = require('socketio-jwt');
const msgUserCont = require('./messgesuser/controller');
const userCont = require('./Users/controller');


const isOnline = (io, id) => {
  const room = io.sockets.adapter.rooms[id];
  // io.sockets.adapter.rooms[mongoID]
  return room !== undefined;
};

// emitStatus my status not other
const emitStatus = (io, mongoID, isonline) => {
  const { follows } = io.sockets.adapter.rooms[mongoID];
  // get list of follows from when you save it
  follows.forEach((element) => {
    // eslint-disable-next-line no-underscore-dangle
    const eleID = element._id;
    const status = io.sockets.adapter.rooms[eleID] !== undefined;
    // true he online , false he offline
    if (status) {
      io.to(eleID).emit(isonline ? 'online' : 'offline', mongoID);
    }
    if (isonline && status) {
      io.to(mongoID).emit(status ? 'online' : 'offline', eleID); // emit to me if this online or not
    }
  });
};

const follow = (io, otherid, sendId) => {
  // console.log("HELLO FOLLOW FUNCTION")
  userCont.addFollow(sendId, otherid);
  try {
    io.sockets.adapter.rooms[otherid].follows.add(sendId);
    return true;
  } catch (err) {
    return false;
  }
  //  console.log(io.sockets.adapter.rooms[mongoID].follow)
};

module.exports = (server) => {
  Socket.prototype.onclose = (reason) => {
    this.emit('disconnecting', reason); // <--insert the new event here
    this.leaveAll();
    this.emit('disconnect', reason);
  };
  const io = Socket(server);

  io.use(socketioJwt.authorize({
    secret: 'secret',
    handshake: true,
    callback: 15000,
  }));

  io.on('connect', (socket) => {
    const mongoID = socket.decoded_token.id;
    socket.join(mongoID, () => {
      io.sockets.adapter.rooms[mongoID].follows = new Set();
      userCont.getFollowById(mongoID, 0).then((data) => {
        io.sockets.adapter.rooms[mongoID].follows = data;

        emitStatus(io, mongoID, true);
      });
    });
    socket.on('chatting', (data) => {
      // eslint-disable-next-line no-unused-expressions
      isOnline(io, data.reciveid)
        ? socket.to(data.reciveid).to(mongoID).emit('reciverPeer', data)
        : socket.to(mongoID).emit('reciverPeer', data);
      msgUserCont.addMsg(data);
    });

    socket.on('follow', async (otherid, name, callback) => {
      if (otherid) {
        callback(follow(io, otherid, mongoID)); // return isonline
      } else {
        const user = await userCont.findUserByName(name);
        callback(follow(io, user._id, mongoID), user);
      }
    });
    socket.on('disconnecting', () => {
      emitStatus(io, mongoID, false);
    });
  });
  // use this io.sockets.clients[_your id here_]
};

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
