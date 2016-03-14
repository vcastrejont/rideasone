angular.module('carPoolingApp').factory('socketService', socketService);

socketService.$inject = [
  "socketFactory"
];

function socketService(socketFactory) {
  //Create socket and connect to http://chat.socket.io
  var ioSocket = io.connect('http://localhost:3000/#/');

	socket = socketFactory({
  	ioSocket: ioSocket
	});

  socket.on('connect', function() {
    socket.emit('add user', user);

    // On login display welcome message
    socket.on('login', function (users) {
      //Set the value of connected flag
      addMessageToList("", false, stringifyParticipants(users));
    });

    //On alreadyLoggedIn display alert message
    socket.on('already logged in', function () {
      alert("You have accessed in another device");
    });

    // Whenever the server emits 'new message', update the chat body
    socket.on('new message', function (data) {
      if(data.message && data.username) {
        addMessageToList(data.username, true, data.message);
      }
    });

    // Whenever the server emits 'user joined', log it in the chat body
    socket.on('user joined', function (data) {
      addMessageToList("", false, data.username + " joined");
      addMessageToList("", false, stringifyParticipants(data.users));
    });

    // Whenever the server emits 'user left', log it in the chat body
    socket.on('user left', function (data) {
      addMessageToList("", false, data.username + " left");
      addMessageToList("", false, stringifyParticipants(data.users));
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

	return socket;
}
