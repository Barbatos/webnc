var io = require('socket.io').listen(1337);

io.set('log level', 2);

io.sockets.on('connection', function (socket) {
  socket.emit('connected', { chans: client.opt.channels });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

// =====================================================================

var channels_nokick = ['#csli']
var irc = require('irc');
var util = require('util');
var client = new irc.Client('irc.quakenet.org', 'barbiebot', {
	channels: ['#nodejs'],
	userName: 'barbie',
	realName: 'barbie',
    autoRejoin: false,
	port: 6667,
	debug: true,
});


// =====================================================================

client.addListener('message', function (nick, to, text, message) {
	io.sockets.emit('message', arguments)
});

client.addListener('selfMessage', function ( to, text ) {
	io.sockets.emit('message', [ this.nick , to, text ])
});

client.addListener('ctcp', function (from, to, text, type) {
	io.sockets.emit('message', [ from , to, "["+type+"]** " + text ])
});


client.addListener('join', function (channel, nick, message) {
	if ( nick == this.nick )
		io.sockets.emit('message',[ nick , channel , nick + " join the channel (" + message +")"])
});

// =====================================================================

client.addListener('message', function (nick, to, text, message) {
	if ( text == "ping" ){
		if (to == this.nick )
			this.say( nick , "pong [PM]" )
		else
			this.say( to , "pong [CHAN]" )
	}
});

client.addListener('kick', function (channel, nick, by, reason, message) {
	if ( nick == this.nick ){
		if ( this.autoRejoin) {
			this.say( channel , "You can't kick me !" )
		}
		else if ( channels_nokick.indexOf(channel) != -1 ){
			this.join(channel, function(){
				// I don't know why channel is correctly definied but ... why not !
				this.say( channel , "You can't kick me !" )
			})
		}
	}
	else
		this.say( channel , "Haha " + nick + " s'est fait trop KEN !" )
});

client.addListener('invite', function (channel, from, message) {
	this.join( channel , function(){
		// I don't know why channel is correctly definied but ... why not !
		this.say( channel , "Hummm what's going here ?" )
	})
});


