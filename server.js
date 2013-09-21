var io 		= require('socket.io').listen(1337);
var mysql 	= require('mysql');
var crypto 	= require('crypto');
var irc 	= require('irc');
var util 	= require('util');

var sqldb = mysql.createPool({
	host     : '127.0.0.1',
	user     : 'root',
	password : '',
	database : 'webnc',
});

var client = new irc.Client('irc.quakenet.org', 'barbiebot', {
	channels: 				['#nodejs', '#f1manager'],
	userName: 				'barbie',
	realName: 				'barbie',
    autoRejoin: 			true,
	port: 					6667,
	floodProtection: 		true,
    floodProtectionDelay: 	1000,
	debug: 					true,
});

sqldb.getConnection(function(err, connection, arguments) {
	if(err){
		console.log('Error connecting to the DB: '+err);
	}

	client.addListener('message', function (nick, to, text, message) {
		date = new Date();

		if ( text == "ping" ){
			if (to == this.nick ){
				this.say( nick , "pong [PM]" )
			} else {
				this.say( to , "pong [CHAN]" )
			}
		}
		else {
			arguments.nick = nick;
			arguments.to = to;
			arguments.h = date.getHours();
			arguments.m = date.getMinutes();
			arguments.s = date.getSeconds();

			io.sockets.emit('message', arguments);

			
			post = {from: nick, to: to, date: (date.getTime()/1000), message: message, status: 0 };
			sqldb.query('INSERT INTO messages SET ?', post,  
				function(err, result) {
					if(err){
						throw err;
					}
					connection.release();
				}
			);
		}
	});

	client.addListener('selfMessage', function ( to, text ) {
		io.sockets.emit('message', [ this.nick , to, text ])
	});

	client.addListener('ctcp', function (from, to, text, type) {
		io.sockets.emit('message', [ from , to, "["+type+"]** " + text ])
	});

	client.addListener('join', function (channel, nick, message) {
		if ( nick == this.nick ){
			io.sockets.emit('message', [ nick, channel, nick + " joins the channel (" + message +")"])
		}
	});

	client.addListener('error', function(message) {
		console.log('[IRC] error: ', message);
	});

	io.sockets.on('connection', function (socket) {
	  	socket.auth_key = randomString();
	  	
	  	socket.emit('connected', { chans: client.opt.channels });

	  	socket.emit('auth-key', { 
	  		key: socket.auth_key 
	  	});


		socket.on('auth-login', function (data) {
	  		if(data.username.length < 3){
	  			socket.emit('error-message', { message: 'Please enter a valid username.' });
	  			socket.emit( 'auth-fail');
	  			return false;
	  		}

	  		if(data.password.length < 3){
	  			socket.emit('error-message', { message: 'Please enter a valid password.' });
	  			socket.emit( 'auth-fail');
	  			return false;
	  		}

			sqldb.query('SELECT id, password FROM users WHERE username = '+sqldb.escape(data.username), 
				function(err, rows, fields) {
					if(rows[0]){
						var hashedPassword = crypto.createHash('sha1').update(data.password, 'utf8').digest('hex');
						
						if(hashedPassword == rows[0].password){
							console.log('User '+data.username+' connected!');
							socket.emit( 'auth-logged');
							socket.username = data.username;

							socket.emit('tab-add', { key: '0'  , tab: quakenet });
							socket.emit('tab-add', { key: '0-0', tab: nodejs });
						}
						else {
							socket.emit('error-message', { message: 'Incorrect password.' });
							socket.emit( 'auth-fail');
							return false;
						}
					}
					else {
						socket.emit('error-message', { message: 'Username not found.' });
						socket.emit('auth-fail');
						return false;
					}

					connection.release();
				}
			);
	  	});
	});
});


function randomString() {
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var string_length = 8;
	var randomstring = '';
	for (var i=0; i<string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	}
	return randomstring;
}


/******************************************************************************
								VARS
******************************************************************************/

var quakenet = {
	  name: 'Quakenet',
	  subject: 'Super sujet de la mort qui tue',
	  notifs : 5,
	  messages : [
		{}
	  ]
	};
var nodejs = {
	  name: '#nodejs',
	  subject: 'Super sujet de la mort qui tue',
	  notifs : 0,
	  messages : [
		{}
	  ]
	};
