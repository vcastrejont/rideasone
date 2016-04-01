angular.module('carpooling.controllers')

.controller('ChatCtrl', ChatCtrl);

ChatCtrl.$inject = [
  "$scope",
  "socket",
  "$timeout",
  "$stateParams",
  "eventsFactory",
  "$ionicScrollDelegate"
];

function ChatCtrl($scope, socketIo, $timeout,
  $stateParams, eventsFactory, $ionicScrollDelegate) {

    $scope.sendMessage = sendMessage;
    $scope.updateTyping = updateTyping;
    $scope.messages = [];
    $scope.connected = false;
    $scope.attendees = [];

  	var socket,
    typing = false,
    user = $scope.currentUser,
    eventId = $stateParams.eventId || "";

    eventsFactory.getInfo(eventId)
    .then(function(res) {

      var event = res.data;
      $scope.attendees = event.attendees;

      socket = socketIo.init($scope, {
        user: user,
        eventId: eventId
      });

      $scope.connected = true;
    });

    $scope.$on('socket::addMessageToList', function (e, msgs) {
      updateMessages(e, msgs);
    });

    $scope.$on('socket::removeChatTyping', function (e, msgs) {
      updateMessages(e, msgs);
    });

    function updateMessages(e, msgs) {
       $scope.messages = msgs;
    }

  	//function called when user hits the send button
    function sendMessage() {
      if($scope.message !== undefined && $scope.message !== "") {

        socket.emit('new message', $scope.message);
    		socketIo.addMessageToList(user.name, true, $scope.message);

        socket.emit('stop typing');
        typing = false;

        $scope.message = "";

        $ionicScrollDelegate.scrollBottom();
      }
  	};

  	//function called on Input Change
    function updateTyping() {
      if($scope.connected) {
        if (!typing) {
            typing = true;

            // Updates the typing event
            socket.emit('typing', eventId);
        }
        else if($scope.message === "") {
          typing = false;
          socket.emit('stop typing');
        }
      }
  	};
}
