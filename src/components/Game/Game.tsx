import React, { useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'
import GameBoard from '../../../common/Interfaces/GameBoard'
import styled from 'styled-components'



const Main = styled("div")`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  row-gap: 10px;
  column-gap: 20px;
  padding: 5px;
`;

const Header = styled("div")`
  display: flex;
  justify-content: center;
  width: 100%;
  text-align: center;
  
   div {
     width: 100%;
    
     border-radius: 7px;

     h1 {

     }
   }
`;

const MainContentWrapper = styled("div")`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: stretch;
  row-gap: 10px;
  column-gap: 20px;
  padding-bottom: 40px;
 

  @media (min-width: 800px) {
    flex-wrap: nowrap;
  }
`;

const SideBarLeft = styled("div")`
  width: 100%;
  text-align: center;

  

  @media (min-width: 800px) {
    width: 20%;
  }
`;

const Board = styled("div")`
  width: 100%;
  text-align: center;
  
  @media (min-width: 800px) {
    width: 50%;
  }
`;

const SideBarRight = styled("div")`
  width: 100%;
  text-align: center;
  
  @media (min-width: 800px) {
    width: 20%;
  }
`;

const Footer = styled("div")`
  width: 100%;
  text-align: center;
  
`;

const GameBoardRow = styled("div")`
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
`;

const GameBoardSquare = styled("div")`
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
  font-size: 30px;

  width: 100px;
  height: 100px;

  border: solid whitesmoke 2px;

  &:hover {
    cursor: pointer;
    background-color: #474747;
  }
`;

const HiddenMessages = styled("h3")`
  width: 100%;
  text-align: center;
  color: #f54141;
  margin: 0;
`;

type Props = {
  socket: Socket
}

const Game = (props: Props) => {

  var gameBoardDefault: GameBoard = {
    player1: "Test Player 1",
    player1SocketId: "",
    player2: "Test Player 2",
    player2SocketId: "",
    board: ["", "", "", "", "", "", "", "", ""],
    currentTurnSocketId: "",
    gameHasStarted: false,
    hasWinner: false,
    winner: "",
  };

  const [gameBoard, setGameBoard] = useState(gameBoardDefault)

  const [errorMessage, setErrorMessage] = useState({ msg: "this is a test", isShowingMessage: false });

  useEffect(() => {
    // game board update
    props.socket.on("game board update", (gameBoard: GameBoard) => {
      setGameBoard((prev) => gameBoard);
    })

    // queue update


  }, [])

  // game functionality

  // send turn
  const onSquareClicked = (squareIndex: number) => {
    console.log("square Clicked", squareIndex);
    // check for turn
    if (props.socket.id !== gameBoard.currentTurnSocketId) {
      // not your turn sorry
      console.log("it is not your turn!");
      setErrorMessage({ msg: "Not your turn!", isShowingMessage: true });
      setTimeout(() => {
        setErrorMessage({ msg: "", isShowingMessage: false });
      }, 5000)
      return;
    }

    // check if already played on
    if (gameBoard.board[squareIndex] !== "") {
      console.log("Thats taken already");
      setErrorMessage({ msg: "Sorry bud that's already been played...", isShowingMessage: true });
      setTimeout(() => {
        setErrorMessage({ msg: "", isShowingMessage: false });
      }, 5000)
      return;
    }

    // if we can get this far lets send off our play
    props.socket.emit("")

  }

  return (
    <Main>
      <Header>
        <div>
          <h1>
            Tic-Tac-Toe
          </h1>
        </div>
      </Header>
      {errorMessage.isShowingMessage &&
        <HiddenMessages>
          {errorMessage.msg}
        </HiddenMessages>}

      <MainContentWrapper>
        <SideBarLeft>
          <h2>X</h2>
          <h3>
            {gameBoard.player1}
          </h3>
        </SideBarLeft>
        <Board>
          <GameBoardRow>
            <GameBoardSquare onClick={() => { onSquareClicked(0); }} data-square="0">{gameBoard.board[0]}</GameBoardSquare>
            <GameBoardSquare onClick={() => { onSquareClicked(1); }} data-square="1">{gameBoard.board[1]}</GameBoardSquare>
            <GameBoardSquare onClick={() => { onSquareClicked(2); }} data-square="2">{gameBoard.board[2]}</GameBoardSquare>
          </GameBoardRow>
          <GameBoardRow>
            <GameBoardSquare onClick={() => { onSquareClicked(3); }} data-square="3">{gameBoard.board[3]}</GameBoardSquare>
            <GameBoardSquare onClick={() => { onSquareClicked(4); }} data-square="4">{gameBoard.board[4]}</GameBoardSquare>
            <GameBoardSquare onClick={() => { onSquareClicked(5); }} data-square="5">{gameBoard.board[5]}</GameBoardSquare>
          </GameBoardRow>
          <GameBoardRow>
            <GameBoardSquare onClick={() => { onSquareClicked(6); }} data-square="6">{gameBoard.board[6]}</GameBoardSquare>
            <GameBoardSquare onClick={() => { onSquareClicked(7); }} data-square="7">{gameBoard.board[7]}</GameBoardSquare>
            <GameBoardSquare onClick={() => { onSquareClicked(8); }} data-square="8">{gameBoard.board[8]}</GameBoardSquare>
          </GameBoardRow>
        </Board>
        <SideBarRight>
          <h2>O</h2>
          <h3>
            {gameBoard.player2}
          </h3>
        </SideBarRight>
      </MainContentWrapper>
      <Footer>
        Created by Jordan Burdett using node.js, express, mongodb, socket.io, react
      </Footer>
    </Main>
  )
}

export default Game