// Chatroom
module.exports = function(server) {

  var io = require('socket.io')(server);
  var users = [];

  io.on('connection', function (socket) {

    var addedUser = false;
    var rideId;
    // when the client emits 'new message', this listens and executes
    socket.on('new message', function (data) {

      socket.broadcast.to(data.rideId).emit('new message', {
        username: socket.user.name,
        message: data.message
      });
    });

    // when the client emits 'add user', this listens and executes
    socket.on('add user', function (data) {

      if (addedUser) return;

      if(users.length > 0) {
        for(var i = 0; i < users.length; i++) {
          if(data.user.id === users[i].id) {
            socket.emit('already logged in');
            return;
          }
        }
      }

      // we store the username in the socket session for this client
      rideId = data.rideId;
      socket.join(data.rideId);
      socket.user = data.user;
      users.push(socket.user);
      addedUser = true;

      socket.emit('login', users);

      // echo globally (all clients) that a person has connected
      socket.broadcast.to(data.rideId).emit('user joined', {
        username: socket.user.name,
        users: users
      });
    });

    // when the client emits 'typing', we broadcast it to others
    socket.on('typing', function (rideId) {

      socket.broadcast.to(rideId).emit('typing', {
        username: socket.user.name
      });
    });

    // when the client emits 'stop typing', we broadcast it to others
    socket.on('stop typing', function (rideId) {

      socket.broadcast.to(rideId).emit('stop typing', {
        username: socket.user.name
      });
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', function (rideId) {

      if (addedUser) {
        users.splice(users.indexOf(socket.user), 1);

        // echo globally that this client has left
        socket.broadcast.to(rideId).emit('user left', {
          username: socket.user.name,
          users: users
        });
      }
    });
  });
}
