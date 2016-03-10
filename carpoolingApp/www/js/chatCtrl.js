angular.module('carpooling.controllers')

.controller('ChatCtrl',function($scope, socket,$sanitize,$ionicScrollDelegate,$timeout) {

  	var typing = false;
  	var lastTypingTime;
  	var TYPING_TIMER_LENGTH = 100;

    $scope.nickname = $scope.isAuthenticated ? $scope.currentUser.name : "";
  	//Add colors
  	var COLORS = [
	    '#e21400', '#91580f', '#f8a700', '#f78b00',
	    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
	    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
	  ];

	 //initializing messages array
	  $scope.messages = [];

  	socket.on('connect',function(){

  	  $scope.connected = true

  	  //Add user
  	  socket.emit('add user', $scope.nickname);

  	  // On login display welcome message
  	  socket.on('login', function (data) {
  	    //Set the value of connected flag
  	    $scope.connected = true
  	    $scope.number_message= message_string(data.numUsers)

  	  });

  	  // Whenever the server emits 'new message', update the chat body
  	  socket.on('new message', function (data) {
  	  	if(data.message&&data.username)
  	  	{
  	   		addMessageToList(data.username,true,data.message)
  	  	}
  	  });

  	  // Whenever the server emits 'user joined', log it in the chat body
  	  socket.on('user joined', function (data) {
  	  	addMessageToList("",false,data.username + " joined")
  	  	addMessageToList("",false,message_string(data.numUsers))
  	  });

  	  // Whenever the server emits 'user left', log it in the chat body
  	  socket.on('user left', function (data) {
  	    addMessageToList("",false,data.username+" left")
  	    addMessageToList("",false,message_string(data.numUsers))
  	  });

  	  //Whenever the server emits 'typing', show the typing message
  	  socket.on('typing', function (data) {
  	    addChatTyping(data);
  	  });

  	  // Whenever the server emits 'stop typing', kill the typing message
  	  socket.on('stop typing', function (data) {
  	    removeChatTyping(data.username);
  	  });
  	});

  	//function called when user hits the send button
  	$scope.sendMessage = function(){
      if($scope.message != undefined) {
        socket.emit('new message', $scope.message);
    		addMessageToList($scope.nickname, true, $scope.message);
    		socket.emit('stop typing');
    		$scope.message = "";
      }
  	};

  	//function called on Input Change
  	$scope.updateTyping=function(){
  		sendUpdateTyping()
  	}

  	// Display message by adding it to the message list
  	function addMessageToList(username,style_type,message){
  		username = $sanitize(username)
  		removeChatTyping(username)
  		var color = style_type ? getUsernameColor(username) : null
  		$scope.messages.push({content:$sanitize(message),style:style_type,username:username,color:color})
  		$ionicScrollDelegate.scrollBottom();
  	}

  	//Generate color for the same user.
  	function getUsernameColor (username) {
	    // Compute hash code
	    var hash = 7;
	    for (var i = 0; i < username.length; i++) {
	       hash = username.charCodeAt(i) + (hash << 5) - hash;
	    }
	    // Calculate color
	    var index = Math.abs(hash % COLORS.length);
	    return COLORS[index];
  	}

  	// Updates the typing event
  	function sendUpdateTyping(){
  		if($scope.connected){
  			if (!$scope.typing) {
		        $scope.typing = true;
		        socket.emit('typing');
		    }
  		}
  		lastTypingTime = (new Date()).getTime();
  		$timeout(function () {
	        var typingTimer = (new Date()).getTime();
	        var timeDiff = typingTimer - lastTypingTime;
	        if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
	          socket.emit('stop typing');
	          typing = false;
	        }
      	}, TYPING_TIMER_LENGTH)
  	}

  	// Adds the visual chat typing message
  	function addChatTyping (data) {
  	    addMessageToList(data.username,true," is typing");
  	}

  	// Removes the visual chat typing message
  	function removeChatTyping (username) {
  	  	$scope.messages = $scope.messages.filter(function(element){return element.username != username || element.content != " is typing"})
  	}

  	// Return message string depending on the number of users
  	function message_string(number_of_users)
  	{
      var strParticipants;

      if(number_of_users === 1) {
        strParticipants = "1 participant";
      }
      else {
        strParticipants = number_of_users + " participants";
      }

      return strParticipants + " in this conversation";
  	}
});
