const express = require('express');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const activeUsers = [];
const activeUsersNick = [];

const refactorActive = (action, userName) => {
  if (action === 'disconnect') {
    const indexUser = activeUsers.findIndex((el) => el.id === userName.id);
    activeUsers.splice(indexUser, 1);
    activeUsersNick.length = 0;
    activeUsers.map((user) => activeUsersNick.push(user.userName));
  } else if (action === 'connect') {
    activeUsers.push(userName);
    activeUsersNick.push(userName.userName);
  }
};

server.listen(3000, 'localhost', () => {
  console.log('port 3000');
});

app.use(express.static('public'));

io.on('connection', async (socket) => {
  socket.on('message', (data) => {
    socket.broadcast.emit('message', {
      user: socket.userName,
      message: data,
    });
  });

  socket.on('Login', (user) => {
    socket.userName = user.userName;
    refactorActive('connect', user);

    socket.emit('Login', {
      activeUsersNick,
    });
    socket.broadcast.emit('Login', {
      activeUsersNick,
    });

    socket.on('disconnect', async () => {
      const userName = {
        userName: socket.userName,
        id: socket.id,
      };
      await refactorActive('disconnect', userName);
      socket.broadcast.emit('disconnectUser', {
        activeUsersNick,
      });
    });
  });
});
