const { client } = require('../logic/databaseConnection');

exports.getNameBySocketId = async (socketId) => {
    await client.connect();
    let user = await client.db("TicTacToe").collection("ActiveNames").findOne({ socketId: socketId });
    let name = user?.name;
    if (name === undefined) name = null;

    return { socketId: socketId, name: name };
}

exports.getQueues = async () => {
    const queueX = await client.db("TicTacToe").collection("QueueX").find({}, { projection: { _id: false, socketId: true, name: true } }).toArray();
    console.log("This is what is in x queue", queueX);

    const queueY = await client.db("TicTacToe").collection("QueueY").find({}, { projection: { _id: false, socketId: true, name: true } }).toArray();
    console.log("This is what is in y queue", queueY);

    return { XQueue: queueX, YQueue: queueY };
}

exports.addSocketIdToQueueX = async (socketId) => {
    await client.connect();

    let user = await this.getNameBySocketId(socketId);
    let name = user.name;
    if (name === null) {
        console.log("We couldn't find name when inserting");
        return null;
    }

    // possibly need to check how many are here to get an position in line and store that in the database

    const result = await client.db("TicTacToe").collection("QueueX").insertOne({ socketId: socketId, name: name });
    if (result.acknowledged) {
        return this.getQueues();
    }

}

exports.addSocketIdToQueueY = async (socketId) => {
    await client.connect();

    let user = await this.getNameBySocketId(socketId);
    let name = user.name;
    if (name === null) {
        console.log("We couldn't find name when inserting");
        return null;
    }

    // possibly need to check how many are here to get an position in line and store that in the database

    const result = await client.db("TicTacToe").collection("QueueY").insertOne({ socketId: socketId, name: name });
    if (result.acknowledged) {
        return this.getQueues();
    }
}


exports.removeSocketIdFromX = async (socketId) => {
    await client.connect();
    let result = await client.db("TicTacToe").collection("QueueX").findOne({ socketId: socketId });
    if (result === null) {
        return true;
    }

    let remove = await client.db("TicTacToe").collection("QueueX").findOneAndDelete({ socketId: socketId });
    
    return remove.ok;
}

exports.removeSocketIdFromY = async (socketId) => {
    await client.connect();
    let result = await client.db("TicTacToe").collection("QueueY").findOne({ socketId: socketId });
    if (result === null) {
        return true;
    }

    let remove = await client.db("TicTacToe").collection("QueueY").findOneAndDelete({ socketId: socketId });
    
    return remove.ok;
}

exports.getGameBoard = async () => {
    await client.connect()
    let result = await client.db("TicTacToe").collection("GameBoard").findOne({});
    console.log("in gameboard get", result);
    if (result === undefined) {
        await insertGameBoard();
        result = await client.db("TicTacToe").collection("GameBoard").findOne({});
    }

    return result;
}

async function insertGameBoard() {
    await client.connect();
    // delete all
    let result = await client.db("TicTacToe").collection("GameBoard").deleteMany({});

    if (!result.acknowledged) {
        console.log("failed to delete gameboard");
        return;
    }

    const gameBoardTemplate = {
        player1: "",
        player1SocketId: "",
        player2: "",
        player2SocketId: "",
        board: [],
        currentTurnSocketId: "",
        gameHasStarted: false,
        hasWinner: false,
        winner: "",
    }

    result = await client.db("TicTacToe").collection("GameBoard").insertOne(gameBoardTemplate);

    if (result.acknowledged) {
        return true;
    }
    else {
        return false;
    }
}


exports.databaseCleanup = async () => {
    console.log("dropping database");
    await client.db("TicTacToe").dropDatabase();
}

