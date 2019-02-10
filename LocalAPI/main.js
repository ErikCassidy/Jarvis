const modules = "./modules";
const solace = modules + "/Solace";

const {Subscriber, Events} = require(solace + "/subscriber.js");
const socket = require (modules + "/Socket.io.js");
const Excel = require(modules + "/ExcelValues.js");

const subscriber = new Subscriber();
const incomeStatement = new Excel();

var values;
incomeStatement.setup("../Data/Excel.csv").then(()=>{
  values = incomeStatement.getColumnTotals();
  console.log(values);
});

subscriber.events.on(Events.MessageReceived, (message)=>{
  let msg = JSON.parse(message);
  let type = msg.messageType;
  let body = msg.body;

  let revenues = values.Revenue;
  let expenses = values.Expenses;
  
  socket.emit(type, {body, revenues, expenses});
})

subscriber.subscribe("Alexa/*");
