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

  return socket;
}
