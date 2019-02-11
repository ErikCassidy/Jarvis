const server = require("http").createServer();
const io = require("socket.io")(server);

io.on("connection", client => {

});

function emit(eventType, eventArg){
  console.log("emitting to all clients eventType", eventType);
  io.emit(eventType, eventArg);
}

server.listen(3000);
module.exports.emit = emit;
