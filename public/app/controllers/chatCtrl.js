angular.module('carPoolingApp').controller('chatCtrl', chatCtrl);

chatCtrl.$inject = [
  "$scope",
  "socketService",
  "$timeout"
];

function chatCtrl($scope, socketService, $timeout) {
  	var typing = false,
        lastTypingTime,
  	    TYPING_TIMER_LENGTH = 100,
        // user = $scope.currentUser,
        COLORS = [
    	    '#e21400', '#91580f', '#f8a700', '#f78b00',
    	    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    	    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
    	  ];

    $scope.messages = [];
    $scope.connected = false;

  	//function called when user hits the send button
  	$scope.sendMessage = function(){
      if($scope.message != undefined) {
        socketService.emit('new message', $scope.message);

    		addMessageToList(user.name, true, $scope.message);
    		socketService.emit('stop typing');

        $scope.message = "";
      }
  	};

  	//function called on Input Change
  	$scope.updateTyping = function() {
      if($scope.connected) {
        if (!$scope.typing) {
            $scope.typing = true;

            // Updates the typing event
            socketService.emit('typing');
        }
      }

      lastTypingTime = (new Date()).getTime();

      $timeout(function () {
        var typingTimer = (new Date()).getTime();
        var timeDiff = typingTimer - lastTypingTime;

        if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
          socketService.emit('stop typing');
          typing = false;
        }

      }, TYPING_TIMER_LENGTH);
  	};

    // Removes the visual chat typing message
    function removeChatTyping (username) {
      $scope.messages = $scope.messages.filter(function(element) {
        return element.username != username || element.content != " is typing"
      });
    }

    // Display message by adding it to the message list
    function addMessageToList(username, style_type, message) {
      var color = style_type ? getUsernameColor(username) : null;

      username = $sanitize(username);
      removeChatTyping(username);

      $scope.messages.push({
        content: $sanitize(message),
        style: style_type,
        username: username,
        color:color
      });

      // $ionicScrollDelegate.scrollBottom();
    }

    // Adds the visual chat typing message
    function addChatTyping (data) {
      addMessageToList(data.username, true, " is typing");
    }

    //Generate color for the same user.
    function getUsernameColor (username) {
      var hash = 7,
          index;

      // Compute hash code
      for (var i = 0; i < username.length; i++) {
         hash = username.charCodeAt(i) + (hash << 5) - hash;
      }
      // Calculate color
      index = Math.abs(hash % COLORS.length);
      return COLORS[index];
    }

    // Return message string depending on the number of users
    function stringifyParticipants(users)
    {
      var strParticipants,
          numUsers = users.length,
          names = [];

      if(numUsers === 1) {
        strParticipants = "Nobody else is in this conversation";
      }
      else if(numUsers > 1) {
        for(var i = 0; i < users.length; i++) {
          names.push(users[i].name);
        }

        strParticipants = numUsers + " participants in this conversation: " +
          names.join(", ");
      }

      return strParticipants;
    }
}
