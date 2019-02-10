var SolaceBase = require("./SolaceBase.js");

class Publisher extends SolaceBase {
  constructor(){
    super();

    this._messagesQueue = [ ];
  }

  publishMessage(topicDestination, messageText){
    this._checkIfReady(topicDestination, messageText, ()=>{
        var message = this._createMessage(topicDestination, messageText);
        this._sendMessage(message);
    });
  }

  /* Messaging */
  _createMessage(destination, messageText){
    let message = this._factory.createMessage();

    message.setDestination(this._createDestination(destination));
    message.setBinaryAttachment(messageText);
    message.setDeliveryMode(this._api.MessageDeliveryModeType.DIRECT);

    this._log('Publishing message "' + messageText + '" to topic "' + destination + '"...');
    return message;
  }
  _sendMessage(message){
    this._try(()=>{
      this._session.send(message)
      this._log("Message sent.");
    });
  }

  /* Queue */
  _addToQueue(destination, text){
    super._addToQueue({destination, text});
  }
  _runFromQueue(message){
    this.publishMessage(message.destination, message.text);
  }
}

/*
var publisher = new Publisher();
publisher.publishMessage("tutorial/topic", "testing");
*/

module.exports = Publisher;
