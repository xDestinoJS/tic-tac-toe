const express = require("express");
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const { uuid } = require('uuidv4');

app.use(express.static("public"));

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get('/local', (req, res) => {
  res.sendFile(__dirname + "/views/local.html");
});

app.get('/online/:uuid?', (req, res) => {
  res.sendFile(__dirname + "/views/online.html");
});


io.on('connection', (socket) => {
  let id = socket.handshake.query.uuid
  
  console.log(socket.handshake.query)
  
  socket.on('move', (msg) => {
    console.log(id)
    io.in(id).emit('move', msg);
    console.log(msg)
  });

  if(id != "undefined")
    {
      socket.join(id)
      io.in(id).emit('connected');
    }
  else {
    id = uuid()
    socket.join(id)
    socket.emit("newid", id)
  }
});

http.listen(3000, () => {
  
});
