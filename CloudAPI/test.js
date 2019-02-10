const solace = require("solclientjs");

// Initialize factory with the most recent API defaults
var factoryProps = new solace.SolclientFactoryProperties();
factoryProps.profile = solace.SolclientFactoryProfiles.version10;
solace.SolclientFactory.init(factoryProps);

// enable logging to JavaScript console at WARN level
// NOTICE: works only with ('solclientjs').debug
solace.SolclientFactory.setLogLevel(solace.LogLevel.WARN);

// create the publisher, specifying the name of the subscription topic
var session = solace.SolclientFactory.createSession({
   url: "ws://mr4b11zr9f3.messaging.mymaas.net:80",
   vpnName: "msgvpn-4b11zr9e9",
   userName: "solace-cloud-client",
   password: "m4eme4695ptifhdhsm8nv9kkoh",
});
try {
   session.connect();
   console.log("connected");
} catch (error) {
   console.log(error);
}
