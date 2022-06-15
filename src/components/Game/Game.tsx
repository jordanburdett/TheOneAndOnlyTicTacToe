import React, { useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'
import GameBoard from '../../../common/Interfaces/GameBoard'
import styled from 'styled-components'

type Props = {
  socket: Socket
}

const Main = styled("div")`
  border: solid red 1px;
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
  border: solid blue 1px;
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
  border: solid purple 1px;

  @media (min-width: 800px) {
    flex-wrap: nowrap;
  }
`;

const SideBarLeft = styled("div")`
  width: 100%;
  text-align: center;

  border: solid pink 1px;

  @media (min-width: 800px) {
    width: 20%;
  }
`;

const Board = styled("div")`
  width: 100%;
  text-align: center;
  border: solid red 1px;
  @media (min-width: 800px) {
    width: 50%;
  }
`;

const SideBarRight = styled("div")`
  width: 100%;
  text-align: center;
  border: solid black 1px;
  @media (min-width: 800px) {
    width: 20%;
  }
`;

const Footer = styled("div")`
  width: 100%;
  text-align: center;
  border: solid green 1px;
`;



const Game = (props: Props) => {

  var gameBoardDefault: GameBoard = { 
    player1: "Test Player 1",
    player1SocketId: "", 
    player2: "Test Player 2", 
    player2SocketId: "",
    board: [8], 
    currentTurnSocketId: "",
    gameHasStarted: false,
    hasWinner: false,
    winner: "",
  };

  const [gameBoard, setGameBoard] = useState(gameBoardDefault)

  useEffect(() => {
    // game board update
    props.socket.on("game board update", (gameBoard: GameBoard) => {

    })


  }, [])

  return (
    <Main>
      <Header>
        <div>
          <h1>
            Tic-Tac-Toe
          </h1>
        </div>
      </Header>
      <MainContentWrapper>
        <SideBarLeft>
        <h2>X</h2>
          <h3>
            {gameBoard.player1}
          </h3>
        </SideBarLeft>
        <Board>
          Board
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