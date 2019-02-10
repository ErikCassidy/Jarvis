var solace = require("solclientjs").debug;

const URL = "ws://mr4b11zr9f3.messaging.mymaas.net:80";
const VPN_NAME = "msgvpn-4b11zr9e9";
const USERNAME = "solace-cloud-client";
const PASSWORD = "m4eme4695ptifhdhsm8nv9kkoh";

// Initialize factory with the most recent API defaults
let factory = solace.SolclientFactory;

var factoryProps = new solace.SolclientFactoryProperties();
factoryProps.profile = solace.SolclientFactoryProfiles.version10;
factory.init(factoryProps);

// enable logging to JavaScript console at WARN level
// NOTICE: works only with ('solclientjs').debug
factory.setLogLevel(solace.LogLevel.WARN);

class Solace {
  constructor(){
    this._debug = true;
    this._isReady = false;
    this._queue = [ ];

    this._session = factory.createSession({
       url: URL,
       vpnName: VPN_NAME,
       userName: USERNAME,
       password: PASSWORD,
    });

    this._setupEvents();
    this._connect();
  }

  /* ---- Public Methods ---- */
  exit(){
    if (!this._session) return;

    this._disconnect();
    this._dispose();
  }


  /* ---- Protected Methods ---- */
  /* Getters */
  get _factory(){ return factory; }
  get _api(){ return solace; }

  _createDestination(topicName){ return this._factory.createTopicDestination(topicName); }

  /* Connecting */
  _connect(){
    this._try(()=>this._session.connect());
  }
  _disconnect(){
    this._try(()=>this._session.disconnect());
  }

  /* Queue */
  _addToQueue(details){ this._queue.push(details); }
  _runQueue(){
    for (var message of this._queue)
      this._runFromQueue(message);
    this._queue = [ ];
  }
  _runFromQueue(details){ } // overload for queue use

  _checkIfReady(...args){
    let f = args.pop();

    if (this._isReady) f(...args);
    else this._addToQueue(...args);
  }

  /* Disposal */
  _dispose(){
    this._session.dispose();
    this._session = null;
  }

  /* Event Handling */
  _setupEvents(){
    // define session event listeners
    this._session.on(solace.SessionEventCode.UP_NOTICE, ()=>this._ready());
    this._session.on(solace.SessionEventCode.CONNECT_FAILED_ERROR, (event)=>this._connectFailed(event));
    this._session.on(solace.SessionEventCode.DISCONNECTED, (event)=>this._disconnected(event));
  }
  _ready(){
    this._log('=== Successfully connected and ready to publish messages. ===');

    this._isReady = true;
    this._runQueue();
  }
  _connectFailed(sessionEvent){
    this._log('Connection failed to the message router: ' + sessionEvent.infoStr +
        ' - check correct parameter values and connectivity!');
  }
  _disconnected(sessionEvent){
    this._log('Disconnected.');
    this._dispose();
  }

  /* Error Handling */
  _try(f){
    try {
        f();
    } catch (error) {
        this._throw(error);
    }
  }
  _throw(error){
    this._log(error.toString());
    throw error;
  }

  /* Logging */
  _log(...output){
    if (!this._debug) return;
    console.log(...output);
  }
}

module.exports = Solace;
