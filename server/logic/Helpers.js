const {client} = require('../logic/databaseConnection');

/*******************************************************
 * Helper function to check if socketId is in a queue
 * return "no", "x", "y"
 */
exports.checkForSocketInQueue = async (socketId) => {
    await client.connect();
    let result = await client.db("TicTacToe").collection("QueueX").findOne({ socketId: socketId });
    if (result !== null) {
        return "x";
    }

    result = await client.db("TicTacToe").collection("QueueY").findOne({ socketId: socketId });

    if (result !== null) {
        return "y";
    }

    return "no";
}

