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

/**
 * We need to connect our backend to mongodb.. 
 * After we do this we can start the process of having a actual connectedUsers collection 
 * that contains the socket id as well as the name. We should store other information such as
 * timestamp of connected time. Maybe some other unique identifier. A timestamp of when the user last did something. -- maybe on the last one.
 */

io.on('connection', (socket) => {
    console.log('a user connected. id: ', socket.id);

    socket.emit("alert message", "Welcome to TicTacToe. In order to view or play the game please enter a name.");

    socket.on("disconnecting", () => {
        console.log("A user disconnected");
    })

    socket.on("assign name", (name) => {
      console.log("assign name called");
      console.log(name);

      socket.emit("name received", {success: true, message: "Successfully added name \'" + name + "\' for socket id"});
    })

});

server.listen(3000, () => {
  console.log('listening on *:3000');
});