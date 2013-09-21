
var socket = null;
var $scope = null;

$(function(){
	$(".focus").focus();

	$scope = get_angular();

	socket = io.connect('http://localhost:1337');
	socket.on('auth-key', function (data) {
		socket.auth_key = data.key;
	});

	socket.on('auth-logged', function (data) {
		$scope.$apply(function(){
			// we are now auth logged
			$scope.username = $("#login-username").val();
		})
	});

	socket.on('auth-fail', function (data) {
		$scope.$apply(function(){
			$scope.username = '';
		})
	});
  
	socket.on('tab-add', function (data) {
		$scope.addTab( data.key , data.tab );
		$scope.$apply(); // apply modifications
	});

	socket.on('message-add', function (data) {
		$scope.addMessage( data.key , data.message );
		$scope.$apply(); // apply modifications
	});

	socket.on('error-message', function (data) {
		$scope.$apply(function() {
			$scope.errorMessage = data.message;
		});
	});

	socket.on('message', function (data) {
		wText=data[2];
		wText=wText.replace(/&/g, "&amp;");
		wText=wText.replace(/"/g, "&quot;");
		wText=wText.replace(/</g, "&lt;");
		wText=wText.replace(/>/g, "&gt;");
		wText=wText.replace(/'/g, "&#146;");
		wText=wText.replace(/ /g, "&nbsp;");
		$("#messagesList").append("<tr><td>"+ data.h +":"+ data.m +":"+data.s+"</td><td>"+ data[0] +"</td><td>"+ wText +"</td></tr>");
		//notify("", data[0] + " => " + data[1], data[2] );
		$("#messagesList").animate({ scrollTop: $("#messagesList").prop("scrollHeight") }, 50);
	});
});

function get_angular(){
	return angular.element(document.body).scope();
}

function getObjKey( key ){
	if ( typeof key == "string" ){
		var tmp = key.split('-');
		
		key = { server: null , channel: null };
		key.server = tmp[0];
		
		if ( tmp.length == 2){
			key.channel = tmp[1];
		}
		return key;
	}
	else {
		if (typeof key.channel == "undefined" ){
			key.channel = null;
		}
		return key;
	}
}

function getStrKey( key ){
	if ( typeof key != "string" ){
		var tmp = ""
		tmp += key.server;
		
		if ( typeof key.channel != "undefined" && key.channel != null){
			tmp += "-" + key.channel;
		}
		return tmp;
	}
	else {
		return key;
	}
}

angular.module("webnc", []).filter('irc_message', function () {
	return function(text){
		return text.replace(/ /g, '&nbsp;');
	}

}).controller("webnc", function($scope) {

	$scope.username = '';
	$scope.errorMessage = '';

	$scope.tabs = [];
	$scope.selected_tab = '';

	$scope.test = function( arg ){
		socket.emit('test')
	}

	$scope.tabExist = function( key ){
		key = getObjKey( key );

		if ( key.channel == null ){
			if (typeof $scope.tabs[ key.server ] != "undefined"){
				return true;
			}
			else {
				return false;
			}
		} 
		else {
			if (typeof $scope.tabs[ key.server ] == "undefined"){
				return -1;
			}
			if (typeof $scope.tabs[ key.server ].channels[ key.channel ] != "undefined"){
				return true;
			}
			else {
				return false;
			}
		}
	}

	$scope.getTab = function( key ){
		key = getObjKey( key )
		
		if ($scope.tabExist(key) !== true){
			return false;
		}
		if ( key.channel == null ){
			return $scope.tabs[ key.server ];
		}
		else {
			return $scope.tabs[ key.server ].channels[ key.channel ];
		}
	}

	$scope.selectTab = function( key ){
		// save current scroll Height
		var last_selected = $scope.getTab( $scope.selected_tab )
		last_selected.scrollTop = $(document.body).prop('scrollTop');
		last_selected.last_seen = new Date();

		// switch tab
		$scope.selected_tab = getStrKey( key );
	
		// restore scroll Height ( + setTimeout for bugfix )
		$(document.body).stop(true, true).prop({scrollTop: $scope.getTab( $scope.selected_tab ).scrollTop })
		
		setTimeout(function(){
			var $scope = get_angular();
			$(document.body).stop(true, true).prop({scrollTop: $scope.getTab( $scope.selected_tab ).scrollTop })
		},100)

		// clear notiffs
		$scope.getTab(key).notifs = 0;
	}

	$scope.login = function(){
		var credital = md5( $("#login-password").val() );
		$("#login-password").val('');
		socket.emit('auth-login', { password: credital, username: $("#login-username").val() });
	}

	$scope.addTab = function( key , tab ){  
		key = getObjKey( key );
		var new_tab;

		if ( key.channel == null ){
			// We REFUSE to REPLACE a server
			if ($scope.tabExist(key) !== false){
				return false;
			}
		
			$scope.tabs[ key.server ]           = tab;
			$scope.tabs[ key.server ].channels  = [];
			new_tab = $scope.tabs[ key.server ];
		} 
		else {
			// We REFUSE to REPLACE a channel and the server MUST exist
			if ($scope.tabExist(key) !== false){
				return false;
			}
			$scope.tabs[ key.server ].channels[ key.channel ] = tab;
			new_tab = $scope.tabs[ key.server ].channels[ key.channel ];
		}

		// set default values
		new_tab.scrollTop = 0;
		new_tab.last_seen = new Date();
		new_tab.key       = getStrKey( key );

		// correct the date string into Date object
		for (var i = new_tab.messages.length - 1; i >= 0; i--) {
			if ( typeof new_tab.messages[i].date == 'string'){
				new_tab.messages[i].date = new Date( new_tab.messages[i].date );
			}
		};

		// First element added, select it and correct css bug
		if ( $scope.selected_tab == '' ){
			$scope.selected_tab = getStrKey( key );
			setTimeout(function(){
				$(".bs-docs-sidebar ul li:first a").trigger('click'); // drop a bug with css
			}, 50)
		}
	
		// add affix on live elements
		setTimeout(function( strKey ){
			$("#messages_"+strKey+" [data-spy=affix]").affix(); // drop a bug with bootstrap affix
		}, 50, getStrKey( key ) );

		return true;
	}

	$scope.addMessage = function( key , message ) {
		var tab = $scope.getTab( key )
		if (typeof message.date == 'string'){
			message.date = new Date( message.date );
		}
		tab.messages.push( message );

		if ($scope.selected_tab != getStrKey(key)){
			tab.notifs++;
		} 
		else {
			$(document.body).stop(true, true).animate({scrollTop: $(document.body).prop('scrollHeight')}, 500)
		}
		
		return true;
	}
});
