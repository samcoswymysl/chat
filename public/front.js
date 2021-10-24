const socket = io();
const messageInput = document.querySelector('.message');
const userNameInput = document.querySelector('.userName');
const usersList = document.querySelector('.userList');
const divs = document.querySelectorAll('.divToggle');

const messageWindow = document.querySelector('.messageWindow');
let userName;

const creteMessage = (message, user) => {
  const newMessage = document.createElement('div');
  const usernameDiv = document.createElement('div');
  const messageVal = document.createElement('div');
  usernameDiv.classList.add('userNickInChat');
  if (user === userName) {
    newMessage.classList.add('yourMassage');
  } else {
    newMessage.classList.add('odderMessage');
  }

  usernameDiv.innerText = user;
  messageVal.classList.add('messageVal');
  messageVal.innerText = message;

  newMessage.append(usernameDiv, messageVal);
  messageWindow.append(newMessage);
  messageInput.value = '';
};

const showOnlineUsers = (activeUsers) => {
  usersList.innerHTML = '';
  activeUsers.map((user) => {
    const newLi = document.createElement('li');
    newLi.innerText = user;
    usersList.append(newLi);
  });
};

const writeNameUsers = () => {
  if (userName === undefined || userNameInput.value === userName) {
    userName = userNameInput.value;
    divs.forEach((div) => div.classList.toggle('hideDiv'));
    socket.emit('Login', {
      userName,
      id: socket.id,
    });
  } else {
    userNameInput.value = userName;
    alert('You can\'t change nick');
  }
};

socket.on('Login', (name) => {
  const { activeUsersNick } = name;
  showOnlineUsers(activeUsersNick);
});

socket.on('disconnectUser', ({ activeUsersNick }) => {
  showOnlineUsers(activeUsersNick);
});

socket.on('message', (data) => {
  const { message, user } = data;

  creteMessage(message, user);
});

messageInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    if (messageInput.value === '') {
      messageInput.setAttribute('placeholder', 'Message can\'t be empty');
      return;
    }
    messageInput.setAttribute('placeholder', 'Write your message');
    socket.emit('message', messageInput.value);
    creteMessage(messageInput.value, userName);
  }
});
userNameInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    if (userNameInput.value === '') {
      userNameInput.setAttribute('placeholder', 'We need Your nick');
      return;
    }
    writeNameUsers();
  }
});
