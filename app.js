const express = require('express');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

server.listen(3000, 'localhost', () => {
  console.log('port 3000');
});

app.use(express.static('public'));

io.on('connection', (socket) => {
  socket.on('message', (data) => {
    console.log(socket.userName, data);
    socket.broadcast.emit('message', {
      user: socket.userName,
      message: data,
    });
  });

  socket.on('Login', (userName) => {
    socket.userName = userName;
    console.log(socket.userName);

    socket.broadcast.emit('Login', {
      user: socket.userName,
    });
  });
});
