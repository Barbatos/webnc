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
	// static var
	if ( typeof this.last_data == 'undefined' )
		this.last_data = "";

	data = this.last_data + data;
	data = data.split('\r\n');
	for (var i = 0; i < data.length -1 ; i++) {

		var command, args = '', prefix = '';
		var tmp = data[i].split(' ');

		if ( data[i].charAt(0) == ':' )
			prefix	= tmp.shift();

		command	= tmp.shift();
		args	= tmp.join(' ');

		if ( 0 == irc.handle( command, prefix, args, data[i] ) )
			console.log('RECV -', data[i]);
	}

	this.last_data = data[ data.length -1 ];
});
 
irc.socket.on('connect', function()
{
	console.log('\n\n===============================================================================');
	console.log('Established connection, registering and shit...');

	setTimeout(function()
	{
		irc.nick( config.user.nick);
		irc.user( config.user.user , config.user.real);
		setTimeout(function()
		{
			for (var i = 0; i < config.chans.length; i++)
			{
				irc.join(config.chans[i], function (matches, command, prefix, args, raw ){
					irc.message( matches[1] , "I'm online !" );
				});
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

irc.listeners = []; // [ command, regex, callback, once? ]
//handles incoming messages
irc.handle = function( command, prefix, args, raw )
{
	var i, matches, used = 0;
	for (i = 0; i < irc.listeners.length; i++)
	{
		if ( irc.listeners[i][0] == "*" || irc.listeners[i][0] == command ){

			matches = irc.listeners[i][1].exec(raw);
			// regex match ?
			if (matches) {
				irc.listeners[i][2](matches, command, prefix, args, raw );
				used ++;

				// it's once listener ?
				if (irc.listeners[i][3])
					irc.listeners.splice(i, 1);
			}
		}
	}
	return used;
}


// ============================================================== //
//                          FX TOOLS                              //
// ============================================================== //
function drop_before( delim, args ){
	args = args.split( delim )
	args.shift()
	args = args.join( delim )
	return args;
}
// ============================================================== //
//                         FX LEVEL 0                             //
// ============================================================== //

irc.on = function( command, regex, callback) {
	irc.listeners.push([command, regex, callback, false])
}

irc.on_once = function( command, regex, callback) {
	irc.listeners.push([command, regex, callback, true]);
}
 
irc.raw = function(data) {
	irc.socket.write(data + '\r\n', 'ascii', function()
	{
		// console.log('SENT -', data);
	});
}

irc.on( 'PING', /.*/ , function(matches, command, prefix, args, raw ) {
	irc.raw( 'PONG ' + args );
});

// ============================================================== //
//                         FX LEVEL 1                             //
// ============================================================== //

irc.on( "NOTICE" , /NOTICE \* / , function (matches, command, prefix, args, raw ) {
	args = drop_before( ':', args)
	console.log('SRV NOTICE | ',args )
});


// ============================================================== //
//                       SERVER INFOS                             //
// ============================================================== //

// =========>> WELCOME MESSAGE

irc.info = {}
irc.on( "001" , /.*/ , function (matches, command, prefix, args, raw ) {
	args = drop_before( ':', args)
	irc.info.WELCOME = args
});

irc.on( "002" , /.*/ , function (matches, command, prefix, args, raw ) {
	args = drop_before( ':', args)
	irc.info.YOURHOST = args
});

irc.on( "003" , /.*/ , function (matches, command, prefix, args, raw ) {
	args = drop_before( ':', args)
	irc.info.CREATED = args
});

irc.on( "004" , /.*/ , function (matches, command, prefix, args, raw ) {
	args = drop_before( ' ', args)
	irc.info.MYINFO = args
});

irc.on( "005" , /.*/ , function (matches, command, prefix, args, raw ) {
	args = drop_before( ' ', args)
	if ( !irc.info.BOUNCE)
		irc.info.BOUNCE = []
	irc.info.BOUNCE.push( args )
});

// =========>> LUSER STATS

irc.on( "251" , /.*/ , function (matches, command, prefix, args, raw ) {
	args = drop_before( ':', args)
	irc.info.LUSERCLIENT = args
});

irc.on( "252" , /.*/ , function (matches, command, prefix, args, raw ) {
	args = drop_before( ':', args)
	irc.info.LUSEROP = args
});

irc.on( "253" , /.*/ , function (matches, command, prefix, args, raw ) {
	args = drop_before( ':', args)
	irc.info.LUSERUNKNOWN = args
});

irc.on( "254" , /.*/ , function (matches, command, prefix, args, raw ) {
	args = drop_before( ':', args)
	irc.info.LUSERCHANNELS = args
});

irc.on( "255" , /.*/ , function (matches, command, prefix, args, raw ) {
	args = drop_before( ':', args)
	irc.info.LUSERME = args
});

// =========>> STATS

irc.on( "250" , /.*/ , function (matches, command, prefix, args, raw ) {
	args = drop_before( ':', args)
	irc.info.STATSDLINE = args
});

irc.on( "265" , /.*/ , function (matches, command, prefix, args, raw ) {
	args = drop_before( ' ', args)
	irc.info.STATS_NB_NODE = args
});

irc.on( "266" , /.*/ , function (matches, command, prefix, args, raw ) {
	args = drop_before( ' ', args)
	irc.info.STATS_NB_NETWORK = args
});

// =========>> MOTD

irc.on( "375" , /.*/ , function (matches, command, prefix, args, raw ) {
	irc.info.MOTD = args + "\n"
});

irc.on( "372" , /.*/ , function (matches, command, prefix, args, raw ) {
	irc.info.MOTD += args + "\n"
});

irc.on( "376" , /.*/ , function (matches, command, prefix, args, raw ) {
	irc.info.MOTD += args
});

// ============================================================== //
//                         FX LEVEL 1                             //
// ============================================================== //

irc.join = function (chan, callback) {
    if (callback !== undefined) {
        irc.on_once('JOIN', new RegExp('^:' + config.user.nick + '![^@]+@[^ ]+ JOIN (' + chan +')$'), callback);
    }
    irc.raw('JOIN ' + chan);
};

irc.nick = function( nick ) {
	irc.raw('NICK ' + nick );
}

irc.user = function( user , real ){
	irc.raw('USER ' + user + ' <hostname> <servername> :' + real);
}

irc.message = function( who, text){
	irc.raw("PRIVMSG "+ who +" :" + text) ;

	for ( i = who.length ; i < 12 ; i++ )
		who += " "

	user_print = config.user.nick
	for ( i = user_print.length ; i < 12 ; i ++)
		user_print += " "

	console.log( who + ' | ' + user_print + ' | ' + text );
}


// ============================================================== //
//                         FX LEVEL X                             //
// ============================================================== //

irc.on( "PRIVMSG" , /.*/ , function (matches, command, prefix, args, raw ) {

	prefix_print = drop_before( ':' , prefix )
	prefix_print = prefix_print.split('!').shift()

	if ( args.charAt(0) == '#' || args.charAt(0) == '&' ){
		var chan;
		args = args.split(' ')
		chan = args.shift()
		args = args.join(' ')
		args = drop_before( ':' , args )

		var i;
		for ( i = prefix_print.length ; i < 12 ; i++ )
			prefix_print += " "

		for ( i = chan.length ; i < 12 ; i ++)
			chan += " "

		console.log( chan + ' | ' + prefix_print + ' | ' + args );


		if ( args == 'ping')
			irc.message( chan , "pong" )
	}
	else {
		args = args.split(' ')
		chan = args.shift()
		args = args.join(' ')
		args = drop_before( ':' , args )

		var i;
		for ( i = prefix_print.length ; i < 12 ; i++ )
			prefix_print += " "

		user_print = config.user.nick
		for ( i = user_print.length ; i < 12 ; i ++)
			user_print += " "
		console.log( user_print + ' | ' + prefix_print + ' | ' + args );

		if ( args == 'ping')
			irc.message( prefix_print , "pong" )
	}
});

irc.on( "KICK" , /.*/ , function (matches, command, prefix, args, raw ) {
	args = args.split( ' ' )
	if ( args[1] == config.user.nick ){
		irc.join( args[0] , function (matches, command, prefix, args, raw ) {
			irc.message( matches[1] , "You Can't kick me !" );
		} )
	}
	else {
		irc.message( args[0] , "Haha ! " + args[1] + " s'est fait trop KEN !")
	}
})


irc.on( "INVITE" , /.*/ , function (matches, command, prefix, args, raw ) {
	args = args.split( ' ' )
	if ( args[0] == config.user.nick ){
		irc.join( args[1] , function (matches, command, prefix, args, raw ) {
			irc.message( matches[1] , "Hummm what's going here ?" );
		})
	}
})