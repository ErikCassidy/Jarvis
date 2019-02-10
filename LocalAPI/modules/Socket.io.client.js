const socket = require("socket.io-client")("http://localhost:3000");
socket.on('open', (data)=>{
  console.log("opening", data.body, ". values are ", data.values);
});
