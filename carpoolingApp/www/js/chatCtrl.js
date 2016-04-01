angular.module('carpooling.controllers')

.controller('ChatCtrl', ChatCtrl);

ChatCtrl.$inject = [
  "$scope",
  "socketIo",
  "$timeout",
  "$stateParams",
  "eventsFactory",
  "$ionicScrollDelegate",
  "$interval",
  "$ionicModal",
  "mapFactory"
];

function ChatCtrl($scope, socketIo, $timeout, $stateParams, eventsFactory,
  $ionicScrollDelegate, $interval, $ionicModal, mapFactory) {

    $scope.sendMessage = sendMessage;
    $scope.updateTyping = updateTyping;
    $scope.messages = [];
    $scope.connected = false;
    $scope.attendees = [];

  	var socket = null,
    typing = false,
    user = $scope.currentUser,
    eventId = $stateParams.eventId || "";

    eventsFactory.getRideInfo(user, eventId)
    .then(function(res) {

      var ride = res.data;
      $scope.attendees = ride.attendees;

      socket = socketIo.init($scope, user, rideId);

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
  	}

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
  	}

    $scope.distance;

    var stop;
    var eventLat = "29.1011295";
    var eventLng = "-111.015617";

    $scope.viewCarLocation = function() {

      $ionicModal.fromTemplateUrl('templates/mapModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.openModal();

        calculateDistance();
        stop = $interval(calculateDistance, 10000);

        function calculateDistance() {
          mapFactory.calculateDistance(eventLat,eventLng).then(function(distance) {
            $scope.distance = distance;
          });
        }
      });
    };

    $scope.stopSharingLocation = function() {

      if (angular.isDefined(stop)) {
        $interval.cancel(stop);
        stop = undefined;
      }
    };

    $scope.$on('$destroy', function() {
      $scope.modal.remove();
      $scope.stopSharingLocation();
    });

    $scope.$on('modal.hidden', function() {
      $scope.stopSharingLocation();
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      $scope.stopSharingLocation();
    });

    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
}
