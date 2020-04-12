const io = require('socket.io')();
const MAX_CLIENTS = 3;

io.on('connection', client => {

  const rooms = io.nsps['/'].adapter.rooms;

  client.on('join', function(room) {
    console.log('Joined!')
    let numClients = 0
    if (rooms[room]) {
      numClients = rooms[room].length;
    }
    if (numClients < MAX_CLIENTS) {
      client.on('ready', function() {
        client.broadcast.to(room).emit('ready', client.id);
      });
      client.on('offer', function (id, message) {
        client.to(id).emit('offer', client.id, message);
      });
      client.on('answer', function (id, message) {
        client.to(id).emit('answer', client.id, message);
      });
      client.on('candidate', function (id, message) {
        client.to(id).emit('candidate', client.id, message);
      });
      client.on('disconnect', function() {
        client.broadcast.to(room).emit('bye', client.id);
      });
      client.join(room);
    } else {
      client.emit('full', room);
    }
  })
});

io.listen(80);