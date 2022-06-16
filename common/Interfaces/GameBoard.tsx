export default interface GameBoard {
    player1: string;
    player1SocketId: string; 
    player2: string; 
    player2SocketId: string;
    board: string[];
    currentTurnSocketId: string;
    gameHasStarted: boolean;
    hasWinner: boolean;
    winner: string;
  }