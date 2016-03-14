angular.module('carpooling.services')

.factory("ChatFactory", ChatFactory);

function ChatFactory() {
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

    $ionicScrollDelegate.scrollBottom();
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

  return {
    removeChatTyping: removeChatTyping,
    addMessageToList: addMessageToList,
    addChatTyping: addChatTyping,
    getUsernameColor: getUsernameColor,
    stringifyParticipants: stringifyParticipants
  };
}
