let EventEmitter = require('events');
let SolaceBase = require ("./SolaceBase.js");

const ARG_SUBSCRIBE = 0;
const ARG_UNSUBSCRIBE = 1;

const Events = {
  MessageReceived: "Received"
};

class Subscriber extends SolaceBase {
  constructor(){
    super();

    this._isSubscribed = { };
    this.events = new EventEmitter();
  }

  subscribe(topic){
    this._checkIfReady(ARG_SUBSCRIBE, topic, ()=>{
      this._runSubscribe(topic, (...args)=>this._session.subscribe(...args));
    });
  }
  unsubscribe(topic){
    this._checkIfReady(ARG_UNSUBSCRIBE, topic, ()=>{
      this._runSubscribe(topic, (...args)=>this._session.subscribe(...args));
    });
  }

  /* Queue */
  _addToQueue(subscriptionType, topic){
    super._addToQueue({subscriptionType, topic});
  }
  _runFromQueue(details){
    switch (details.subscriptionType){
      case ARG_SUBSCRIBE:
        return this.subscribe(details.topic);
      case ARG_UNSUBSCRIBE:
        return this.unsubscribe(details.topic);
    }
  }

  /* Disconnection */
  _disconnect(){
    this._unsubscribeToAll();
    super._disconnect();
  }

  /* Additional Events */
  _setupEvents(){
    super._setupEvents();

    this._session.on(this._api.SessionEventCode.SUBSCRIPTION_ERROR, (event)=>this._onSubscriptionError(event));
    this._session.on(this._api.SessionEventCode.SUBSCRIPTION_OK, (event)=>this._onSubscriptionOk(event));
    this._session.on(this._api.SessionEventCode.MESSAGE, (message)=>this._onMessage(message));
  }
  _onSubscriptionError(event){ this._log("Cannot subscribe to topic: " + event.correlationKey); }
  _onSubscriptionOk(event){
    let topic = event.correlationKey;

    if (this._isSubscribed[topic]) {
        this._isSubscribed[topic] = false;
        this._log('Successfully unsubscribed from topic: ' + topic);
    } else {
        this._isSubscribed[topic] = true;
        this._log('Successfully subscribed to topic: ' + topic);
        this._log('=== Ready to receive messages. ===');
    }
  }
  _onMessage(message){
    this.events.emit(Events.MessageReceived, message.getBinaryAttachment());
  }

  /* Subscribe */
  _unsubscribeToAll(){
    let subscriptions = this._isSubscribed;
    for (let topic in subscriptions){
      if (subscriptions[topic] === true)
        this.unsubscribe(topic);
    }
  }
  _runSubscribe(topic, f){
    f(
        this._createDestination(topic),
        true, // generate confirmation when subscription is added successfully
        topic, // use topic name as correlation key
        10000 // 10 seconds timeout for this operation
    );
  }
}

/*
var subscriber = new Subscriber();
subscriber.events.on(Events.MessageReceived, console.log);
subscriber.subscribe("tutorial/topic");
*/

module.exports = { Subscriber, Events };
