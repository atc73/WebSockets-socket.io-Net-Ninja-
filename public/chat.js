// Make Connection
var socket = io.connect('http://localhost:4000');

// Query DOM

var message = document.getElementById('message');
var author = document.getElementById('author');
var btn = document.getElementById('send');
var output = document.getElementById('output');
var feedback = document.getElementById('feedback');
var chatWindow = document.getElementById('chat-window');
var myVar;

// Emit Events

var displayTyping = setTimeout(function () {
  feedback.innerHTML = '';
}, 2000);

function updateScroll() {
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

btn.addEventListener('click', function () {
  socket.emit('chat', {
    message: message.value,
    author: author.value,
  });
  message.value = '';
});

message.addEventListener('keypress', function (e) {
  if (e.keyCode === 13) {
    socket.emit('chat', {
      message: message.value,
      author: author.value,
    });
    message.value = '';
  }
});

message.addEventListener('keypress', (e) => {
  if (e.keyCode !== 13) {
    socket.emit('typing', author.value);
  }
});

// Listen for events
socket.on('chat', function (data) {
  output.innerHTML +=
    `<p id=${data.author === author.value ? 'local' : 'ext'}><strong>` +
    data.author +
    ':</strong> ' +
    data.message +
    '</p>';
  updateScroll();
  feedback.innerHTML = '';
});

socket.on('typing', (data) => {
  feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
  clearTimeout(myVar);
  myVar = setTimeout(function () {
    feedback.innerHTML = '';
  }, 3000);
});
