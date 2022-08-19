const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3001",
  },
});
const {client} = require('./logic/databaseConnection');
const { JSDOM } = require("jsdom");
const { window } = new JSDOM();
const { startGameLoop } = require("./logic/gameloop");
const { checkForSocketInQueue } = require("./logic/Helpers");
const { addSocketIdToQueueX, getQueues } = require('./Controllers/DatabaseController');

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

app.get('/databasetest', async (req, res) => {
  try {
    const startTime = window.performance.now();

    await client.connect();
    await client.db("TicTacToe").collection("names").insertOne({ name: "Jordan", socketId: Math.random() * 1000000, timeStamp: Date.now() });

    let numberOfInserts = 10000;
    let insertNumber = 0;
    while (numberOfInserts !== insertNumber) {
      await client.db("TicTacToe").collection("names").insertOne({ name: "Jordan " + insertNumber, socketId: Math.random() * 1000000, time: Date.now() });
      insertNumber++;
    }
    const endTime = window.performance.now();

    res.send(`<h1>${(endTime - startTime) / 1000}</h1>`);


  }
  catch (error) {
    console.error("we had some kind of error", error);
    res.send("<h1>testing</h1>");
  }
  finally {
    await client.close();
  }
})

/**
 * We need to connect our backend to mongodb.. 
 * After we do this we can start the process of having a actual connectedUsers collection 
 * that contains the socket id as well as the name. We should store other information such as
 * timestamp of connected time. Maybe some other unique identifier. A timestamp of when the user last did something. -- maybe on the last one.
 */

io.on('connection', (socket) => {
  console.log('a user connected. id: ', socket.id);

  socket.emit("alert message", "Welcome to TicTacToe. In order to view or play the game please enter a name.");

  /**************************************************************************
   * ON "disconnecting"
   * This is automatically called when the user disconnects or closes the browser window
   */
  socket.on("disconnecting", async () => {

    await client.connect();

    const activeName = await client.db("TicTacToe").collection("ActiveNames").findOne({ socketId: socket.id })

    if (activeName === null) {
      console.log("user with a socketId of : " + socket.id + " no name was assigned");
    }
    else {
      console.log("user with a socketId of : " + socket.id + " disconnected, name: " + activeName.name);
      await client.db("TicTacToe").collection("ActiveNames").deleteOne({ socketId: socket.id })
    }
  });

  // socket.on("insert test name", async (name) => {
  //   await client.connect();
  //   await client.db("TicTacToe").collection("ActiveNames").insertOne({ name: name, socketId: socket.id, timeStamp: Date.now() });
  //   console.log("name inserted");
  // });

  /**************************************************************************
   * ON "assign Name"
   */
  socket.on("assign name", async (name) => {
    // check for a valid name
    if (name === null || name === "") {
      socket.emit("name received", { success: false, name: name, message: "Name was null or empty \'" + name + "\' for socket id: " + socket.id });
      return;
    }

    // connect to the database
    await client.connect();

    // check if the current socket.id is already assigned a name
    const checkNameResponse = await client.db("TicTacToe").collection("ActiveNames").findOne({ socketId: socket.id });

    if (checkNameResponse != null) {
      // the user already has a name assigned to them. Change it.
      const res = await client.db("TicTacToe").collection("ActiveNames").updateOne({ socketId: socket.id }, { $set: { name: name } });
      
      socket.emit("name received", { success: true, name: name, message: "Successfully added name \'" + name + "\' for socket id" });
      return;
    }

    const checkNameTaken = await client.db("TicTacToe").collection("ActiveNames").findOne({ name: name });

    if (checkNameTaken !== null) {
      // The Name has already been taken by another user.
      socket.emit("name received", { success: false, name: name, message: "The name is already in use." });
      return;
    }

    // add the new name to the active name database
    await client.db("TicTacToe").collection("ActiveNames").insertOne({ socketId: socket.id, name: name, timeStamp: Date.now() });
    socket.emit("name received", { success: true, name: name, message: "Successfully added name \'" + name + "\' for socket id" });
  });

  /****
   * Gameplay
   */

  // receive users play -- emit to everyone a new board

  /**** 
   * Queue
   */

  // receive request to join queue
  socket.on("queue join x", async () => {
      console.log("someone is joining the x queue");
      console.log(socket.id);

      // check if socketId is part of a queue
      const queueStatus = await checkForSocketInQueue(socket.id);

      if (queueStatus === "no") {
        // socketId and name to queue
        const newQueues = await addSocketIdToQueueX(socket.id);
        // emmit the new queues
        io.emit("queue update", newQueues);
      }
      else if (queueStatus === "x") {

        // dont do anything just return
      }
      else if (queueStatus === "y") {
        // remove the queue from y

        // add the queue to x

        // emmit the new queues
      }
  });

  socket.on("queue join y", async () => {
    console.log("someone is joining the y queue");
    console.log(socket.id);

    // check if socketId is part of a queue
    const queueStatus = await checkForSocketInQueue(socket.id);

    if (queueStatus === "no") {
      // socketId and name to queue

      // emmit the new queues
    }
    else if (queueStatus === "x") {
      // remove the queue from x

      // add the y to the queue

      // emmit the new queues
      
    }
    else if (queueStatus === "y") {
      // dont do anything just return
    }
});

socket.on("queue request queues", async () => {
  socket.emit("queue update", await getQueues());
})

  
  

});

server.listen(3000, () => {
  console.log('listening on *:3000');
});