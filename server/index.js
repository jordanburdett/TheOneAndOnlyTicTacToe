const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:3001",
    },
  });

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

io.on('connection', (socket) => {
    console.log('a user connected.');

    socket.emit("alert message", "Welcome to TicTacToe. In order to view or play the game please enter a name.");

    socket.on("disconnecting", () => {
        console.log("A user disconnected");
    })
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});