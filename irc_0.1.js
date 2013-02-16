var net = require('net'),
	irc = {}, config;
 
config = {
	user: {
		nick: 'test_nodejs',
		user: 'my_user',
		real: 'my_real',
		pass: ''
	},
	server: {
		addr: 'irc.freenode.net',
		port: 6667
	},
	chans: ['#csli']
}
 
irc.socket = new net.Socket();
 
irc.socket.on('data', function(data)
{
	if ( typeof this.last_data == 'undefined' ) this.last_data = "";

	data = this.last_data + data;
	data = data.split('\r\n');
	for (var i = 0; i < data.length -1 ; i++)
	{
		if ( 0 == irc.handle(data[i].slice(0, -1)) )
			console.log('RECV -', data[i]);
	}

	this.last_data = data[ data.length -1 ];
});
 
irc.socket.on('connect', function()
{
	console.log('\n\n===============================================================================');
	console.log('Established connection, registering and shit...');
	
	irc.on(/^PING :(.+)$/i, function(info)
	{
		console.log('RECV -', info[0] );
		irc.raw('PONG :' + info[1]);
	});
	setTimeout(function()
	{
		irc.nick( config.user.nick);
		irc.user( config.user.user , config.user.real);
		setTimeout(function()
		{
			for (var i = 0; i < config.chans.length; i++)
			{
				irc.join(config.chans[i]);
			}
		}, 2000);
	}, 1000);
});
 
irc.socket.setEncoding('ascii');
irc.socket.setNoDelay();
irc.socket.connect(config.server.port, config.server.addr);
 
// ============================================================== //
//                         LISTENERS                              //
// ============================================================== //

irc.listeners = [];
//handles incoming messages
irc.handle = function(data)
{
	var i, info, used = 0;
	for (i = 0; i < irc.listeners.length; i++)
	{
		info = irc.listeners[i][0].exec(data);
		if (info)
		{
			irc.listeners[i][1](info, data);
			if (irc.listeners[i][2])
			{
				irc.listeners.splice(i, 1);
			}
			used ++;
		}
	}
	return used;
}


// ============================================================== //
//                         FX LEVEL 0                             //
// ============================================================== //
 
irc.on = function(data, callback) {
	irc.listeners.push([data, callback, false])
}

irc.on_once = function(data, callback) {
	irc.listeners.push([data, callback, true]);
}
 
irc.raw = function(data) {
	irc.socket.write(data + '\n', 'ascii', function()
	{
		console.log('SENT -', data);
	});
}


// ============================================================== //
//                         FX LEVEL 1                             //
// ============================================================== //

irc.on(/^[^ ]+ 375 [0-9a-zA-Z\[\]\\`_\^{|}\-]+ :(.*)/, function ( motd ) {
	console.log('\nMOTD START | ', motd[1] )
});

irc.on(/^[^ ]+ 372 [0-9a-zA-Z\[\]\\`_\^{|}\-]+ :(.*)/, function ( motd ) {
	console.log('MOTD       | ', motd[1] )
});

irc.on(/^[^ ]+ 376 [0-9a-zA-Z\[\]\\`_\^{|}\-]+ :(.*)/, function ( motd ) {
	console.log('MOTD END   | ', motd[1] , '\n')
});

// ============================================================== //
//                         FX LEVEL 1                             //
// ============================================================== //

irc.join = function (chan, callback) {
    if (callback !== undefined) {
            irc.on_once(new RegExp('^:' + irc.info.nick + '![^@]+@[^ ]+ JOIN :' + chan), callback);
    }
    irc.raw('JOIN ' + chan);
};

irc.nick = function( nick ) {
	irc.raw('NICK ' + nick );
}



irc.user = function( user , real ){
		irc.raw('USER ' + user + ' <hostname> <servername> :' + real);
}