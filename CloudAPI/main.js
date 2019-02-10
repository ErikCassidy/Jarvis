const modules = "./modules";
const solace  = modules + "/Solace";

const express = require("express");
const bodyParser = require("body-parser");
const Publisher = require(solace + "/Publisher.js");

const app = express();
const publisher = new Publisher();

const base = "Alexa/";

app.use(bodyParser.urlencoded({extended: true}));

function sendMessage(address, req){
  publisher.publishMessage(base + address, JSON.stringify({
    messageType: address,
    body: req.body
  }));
}

app.post("/alexa/:type", (req, res)=>{
  sendMessage(req.params.type, req);
  res.sendStatus(200);
});

app.listen(2402, ()=>{
  console.log("app is listening");
});
