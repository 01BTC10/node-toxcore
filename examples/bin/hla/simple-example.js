var toxcore = require('toxcore');

// Specify nodes to bootstrap from
var nodes = [
  { maintainer: 'saneki',
    address: '96.31.85.154',
    port: 33445,
    key: '674153CF49616CD1C4ADF44B004686FC1F6C9DCDD048EF89B117B3F02AA0B778' },
  { maintainer: 'Impyy',
    address: '178.62.250.138',
    port: 33445,
    key: '788236D34978D1D5BD822F0A5BEBD2C53C64CC31CD3149350EE27D4D9A2F9B6B' },
  { maintainer: 'sonOfRa',
    address: '144.76.60.215',
    port: 33445,
    key: '04119E835DF3E78BACF0F84235B300546AF8B936F035185E2A8E9E0A67C8924F' }
];

// Construct a tox client with default name, status message, etc.
// var client = new toxcore.ToxClient();

// ... or construct a client with an options object:
var client = new toxcore.ToxClient({
  name: 'Simple node-toxcore HLA Bot',
  statusMessage: 'Hello world!',
  status: 'none',
  nodes: nodes
});

// You don't need to give the constructor an options object:
//
// client.name('Simple node-toxcore HLA Bot');
// client.statusMessage('Hello world!');
// client.status('none');
// client.bootstrap(nodes);

// Event 'bootstrap': Listen for a bootstrap event, emitted when the client
//                    bootstraps before starting the tox_iterate interval loop.
// e -> BootstrapClientEvent
//   e.success() -> {Boolean}  Whether or not all nodes were successfully bootstrapped to,
//   e.nodes()   -> {Object[]} Node objects which were successfully bootstrapped to
//   e.failed()  -> {Object[]} Node objects which failed
//client.on('bootstrap', function(e) {
//  ...
//});

// Event 'request': Listen for a friend request
// Shortcut for client.friends().on('request', ... )
// e -> FriendRequestEvent
//   e.publicKey()    -> {Buffer} Public key buffer
//   e.publicKeyHex() -> {String} Public key as a hex string
//   e.message()      -> {String} Request message
client.on('request', function(e) {
  client.friends().addNoRequest(e.publicKey());
});

// Event 'message': Listen for a friend message
// Shortcut for client.friends().on('message', ... )
// e -> FriendMessageClientEvent
//   e.friend()      -> {ToxFriend} Tox friend instance
//   e.message()     -> {String}    Message
//   e.messageType() -> {Number}    Message type
//   e.isNormal()    -> {Boolean}   Whether the sent message was normal (non-action)
//   e.isAction()    -> {Boolean}   Whether the sent message was an action
client.on('message', function(e) {
  var friend = e.friend(), message = e.message();
  if(message === 'goodbye') {
    friend.remove();
  } else {
    // Echo back message
    if(e.isNormal()) {
      friend.send(message);
    } else {
      friend.action(message);
    }
  }
});

console.log('Address: ' + client.address());

client.start();
