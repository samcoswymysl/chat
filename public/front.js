const socket = io();

const input = document.querySelector('input');
const ul = document.querySelector('ul');

socket.on('message', (data) => {
  const { message } = data;
  const newMessage = document.createElement('li');
  newMessage.innerText = message;
  ul.append(newMessage);
  console.log(message);
});

input.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    socket.emit('message', input.value);
    const myMasage = document.createElement('li');
    myMasage.innerText = input.value;
    ul.append(myMasage);
  }
});
