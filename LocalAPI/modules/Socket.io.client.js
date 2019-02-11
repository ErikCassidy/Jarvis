const socket = require("socket.io-client")("http://localhost:3000");
socket.on('alexa_open', (data)=>{
  console.log("opening", data);
});
socket.on('Revenues', (data)=>{
  console.log("revenues are ", data);
})
socket.on('Expenses', (data)=>{
  console.log('expenses are', data);
})
