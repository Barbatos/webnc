var io = require('socket.io').listen(8080);
var crypto = require('crypto');

//io.set('log level', 2);

io.sockets.on('connection', function (socket) {
  socket.key = randomString();
  socket.emit('connected', { key: socket.key });
  socket.on('auth', function (data) {


  	var crypt_pass = crypto.createHash('md5').update( socket.key + 'bonjour', 'utf8').digest('hex');

    if ( data.password == crypt_pass ){
    	socket.emit( 'logged');
    	socket.username = data.username;
  		console.log( data.username + ' logged' );
    } else {
    	socket.emit( 'login failled');
  		console.log( data.username + ' login failled !' );
    }
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
