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

exports.addSocketIdToQueueY = (socketId) => {

}