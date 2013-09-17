var io = require('socket.io').listen(1337);
var crypto = require('crypto');

//io.set('log level', 2);

io.sockets.on('connection', function (socket) {
  socket.auth_key = randomString();
  
  socket.emit('auth-key', { key: socket.auth_key });

  socket.on('auth-login', function (data) {

  	var crypt_pass = crypto.createHash('md5').update( socket.auth_key + 'bonjour', 'utf8').digest('hex');

    if ( data.password == crypt_pass ){
    	socket.emit( 'auth-logged');
    	socket.username = data.username;
  		console.log( data.username + ' logged' );

      // send connected servers / channels
      socket.emit( 'tab-add' , { key: '0'   , tab: quakenet });
      socket.emit( 'tab-add' , { key: '0-0' , tab: frozensand });
      socket.emit( 'tab-add' , { key: '0-1' , tab: pandy });
      socket.emit( 'tab-add' , { key: '1'   , tab: freenode });
      socket.emit( 'tab-add' , { key: '1-0' , tab: csli });


      socket.on('test' , function() {
        var i = 0;
        for (i = 0 ; i < 10 ; i++){
          socket.emit( 'message-add' , { 
              key:{ server: 0 } ,
              message: {date: new Date(), from:'asche', content: randomString() + " " + randomString() + " " + randomString() } });
          socket.emit( 'message-add' , { 
              key:{ server: 0 , channel: 0 } , 
              message: {date: new Date(), from:'asche', content: randomString() + " " + randomString() + " " + randomString() } });
        }

        socket.emit( 'message-add' , { key: '0-1' , message: {date: new Date(), from:'asche', content: '     )     ' } });
        socket.emit( 'message-add' , { key: '0-1' , message: {date: new Date(), from:'asche', content: '     (     ' } });
        socket.emit( 'message-add' , { key: '0-1' , message: {date: new Date(), from:'asche', content: '      )    ' } });
        socket.emit( 'message-add' , { key: '0-1' , message: {date: new Date(), from:'asche', content: ' __.--(--. ' } });
        socket.emit( 'message-add' , { key: '0-1' , message: {date: new Date(), from:'asche', content: '|| |     | ' } });
        socket.emit( 'message-add' , { key: '0-1' , message: {date: new Date(), from:'asche', content: ' \\\\|     | ' } });
        socket.emit( 'message-add' , { key: '0-1' , message: {date: new Date(), from:'asche', content: '  \\.     . ' } });
        socket.emit( 'message-add' , { key: '0-1' , message: {date: new Date(), from:'asche', content: '    `---\'  ' } });

      })

    } else {
    	socket.emit( 'auth-fail');
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


/******************************************************************************
                                VARS
******************************************************************************/

var quakenet = {
      name: 'Quakenet',
      subject: 'Super sujet de la mort qui tue',
      notifs : 5,
      messages : [
        {date: new Date('02/26/13 13:31'), from: 'holblin', content: 'Lorem ipsum dolor sit amet, consectetupteur sint <h1>occaecat</h1> cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        {date: new Date('02/26/13 13:33'), from: 'pandy',   content: 'cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        {date: new Date('02/26/13 13:37'), from: 'holblin', content: 'Lorem ipsum dolor sit amet, consectetupteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        {date: new Date('02/26/13 13:37'), from: 'pandy',   content: 'officia deserunt mollit anim id est laborum.' },
        {date: new Date('02/26/13 13:37'), from: 'pandy',   content: 'Lorem ipsum dolor sit amet, consectetupteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        {date: new Date('02/26/13 17:38'), from: 'holblin', content: 'Lorem ipsum dolor sit amet, consectetupteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        {date: new Date('01/26/13 11:09'), from: 'holblin', content: 'officia deserunt mollit anim id est laborum.' }
      ]
    };
var frozensand = {
      name: '#frozensand',
      subject: 'Super sujet de la mort qui tue',
      notifs : 9,
      messages : [
        {date: new Date('02/26/13 13:31'), from: 'holblin', content: 'Lorem ipsum dolor sit amet, consectetupteur sint <h1>occaecat</h1> cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        {date: new Date('02/26/13 13:33'), from: 'pandy',   content: 'cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        {date: new Date('02/26/13 13:37'), from: 'holblin', content: 'Lorem ipsum dolor sit amet, consectetupteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        {date: new Date('02/26/13 13:37'), from: 'pandy',   content: 'officia deserunt mollit anim id est laborum.' },
        {date: new Date('02/26/13 13:37'), from: 'pandy',   content: 'Lorem ipsum dolor sit amet, consectetupteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        {date: new Date('02/26/13 13:38'), from: 'holblin', content: 'Lorem ipsum dolor sit amet, consectetupteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        {date: new Date('02/26/13 13:39'), from: 'holblin', content: 'officia deserunt mollit anim id est laborum.' }
      ]
    };
var pandy = {
      name: 'pandy',
      subject: 'Super sujet de la mort qui tue',
      notifs : 0,
      messages : [
        {date: new Date('02/26/13 13:31'), from: 'holblin', content: 'Lorem ipsum dolor sit amet, consectetupteur sint <h1>occaecat</h1> cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        {date: new Date('02/26/13 13:33'), from: 'pandy',   content: 'cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        {date: new Date('02/26/13 13:37'), from: 'holblin', content: 'Lorem ipsum dolor sit amet, consectetupteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        {date: new Date('02/26/13 13:37'), from: 'pandy',   content: 'officia deserunt mollit anim id est laborum.' },
        {date: new Date('02/26/13 18:37'), from: 'pandy',   content: 'Lorem ipsum dolor sit amet, consectetupteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        {date: new Date('02/26/13 18:38'), from: 'holblin', content: 'Lorem ipsum dolor sit amet, consectetupteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        {date: new Date('01/26/13 11:39'), from: 'holblin', content: 'officia deserunt mollit anim id est laborum.' }
      ]
    };
var csli = {
      name: 'csli',
      subject: 'Super cslicsli csli la mort qui tue',
      notifs : 0,
      messages : [
        {date: new Date('02/26/13 13:31'), from: 'holblin', content: 'Lorem ipsum csli sit amet, consectetupteur sint <h1>csli</h1> cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        {date: new Date('02/26/13 13:33'), from: 'pandy',   content: 'cupidatat non csli, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        {date: new Date('02/26/13 13:37'), from: 'holblin', content: 'Lorem ipsum dolor sit amet, csli sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        {date: new Date('02/26/13 13:37'), from: 'pandy',   content: 'officia deserunt mollit anim id est laborum.' },
        {date: new Date('02/26/13 13:37'), from: 'pandy',   content: 'Lorem ipsum dolor sit amet, consectetupteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        {date: new Date('02/26/13 18:38'), from: 'holblin', content: 'Lorem ipsum dolor sit amet, consectetupteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        {date: new Date('02/26/13 18:39'), from: 'holblin', content: 'officia deserunt mollit anim id est laborum.' }
      ]
    };
var freenode = {
      name: 'Freenode',
      subject: 'frozensand subject !!!',
      notifs : 8,
      messages : [
        {date: new Date('02/26/13 13:31'), from: 'holblin', content: 'Lorem ipsum dolor sit amet, consectetupteur sint <h1>occaecat</h1> cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        {date: new Date('02/26/13 13:33'), from: 'raider',  content: 'cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        {date: new Date('02/26/13 13:37'), from: 'holblin', content: 'Lorem ipsum dolor sit amet, consectetupteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        {date: new Date('02/26/13 13:37'), from: 'raider',  content: 'officia deserunt mollit anim id est laborum.' },
        {date: new Date('02/26/13 13:37'), from: 'raider',  content: 'Lorem ipsum dolor sit amet, consectetupteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        {date: new Date('02/26/13 18:38'), from: 'holblin', content: 'Lorem ipsum dolor sit amet, consectetupteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        {date: new Date('02/26/13 18:39'), from: 'holblin', content: 'officia deserunt mollit anim id est laborum.' }
      ]
    };
