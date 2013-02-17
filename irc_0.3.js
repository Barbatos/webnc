var io = require('socket.io').listen(8080);

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
var client = new irc.Client('irc.freenode.net', 'test_nodejs', {
	channels: ['#csli'],
	userName: 'my_user',
	realName: 'my_real',
    autoRejoin: false,
	port: 6667,
	debug: true,
});

client.once('join#csli', function (nick, message) {
	if ( nick == client.nick )
		client.say('#csli', "I'm online !" )
});

client.addListener('message', function (nick, to, text, message) {
	if ( text == "ping" ){
		if (to == client.nick )
			client.say( nick , "pong [PM]" )
		else
			client.say( to , "pong [CHAN]" )
	}
});

client.addListener('kick', function (channel, nick, by, reason, message) {
	if ( nick == client.nick ){
		if ( client.autoRejoin) {
			client.say( channel , "You can't kick me !" )
		}
		else if ( channels_nokick.indexOf(channel) != -1 ){
			client.join(channel, function(){
				// I don't know why channel is correctly definied but ... why not !
				client.say( channel , "You can't kick me !" )
			})
		}
	}
	else
		client.say( channel , "Haha " + nick + " s'est fait trop KEN !" )
});

client.addListener('invite', function (channel, from, message) {
	client.join( channel , function(){
		// I don't know why channel is correctly definied but ... why not !
		client.say( channel , "Hummm what's going here ?" )
	})
});

// =====================================================================

client.addListener('message', function (nick, to, text, message) {
	io.sockets.emit('message', arguments)
});

