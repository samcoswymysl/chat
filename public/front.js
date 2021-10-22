const socket = io();
const messageInput = document.querySelector('.message');
const userNameInput = document.querySelector('.userName');
const usersList = document.querySelector('.userList');
const divs = document.querySelectorAll('div');

const ul = document.querySelector('ul');
let yourName;

const creteMessage = (message, user) => {
  const newMessage = document.createElement('li');
  newMessage.innerText = `${user}: ${message}`;
  ul.append(newMessage);
  messageInput.value = '';
};

/* const showOnlineUsers = () => {
  usersList.innerHTML = '';
  onlineUsers.forEach((user) => {
    const newLi = document.createElement('li');
    newLi.innerText = user;
    usersList.append(newLi);
  });
}; */

const writeNameUsers = () => {
  yourName = userNameInput.value;
  divs.forEach((div) => div.classList.toggle('hideDiv'));
  socket.emit('Login', yourName);
};

socket.on('message', (data) => {
  const { message, user } = data;

  creteMessage(message, user);
});

socket.on('Login', (name) => {
  const { user } = name;
  const newLi = document.createElement('li');
  newLi.innerText = user;
  usersList.append(newLi);
});

messageInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    socket.emit('message', messageInput.value);
    creteMessage(messageInput.value, yourName);
  }
});
userNameInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    writeNameUsers();
  }
});
