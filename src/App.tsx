import React, { useEffect, useState } from 'react';
import NameForm from "./components/NameForm/NameForm";
import Game from "./components/Game/Game"
import './App.css';
import { io } from 'socket.io-client'
const socket = io('http://localhost:3000');

function App() {

  const [serverMessage, setServerMessage] = useState("");
  const [hasName, setHasName] = useState(false);
  const [name, setName] = useState("")

  useEffect(() => {
    socket.on('alert message', (message: string) => {
      console.log(message);
      setServerMessage(message);
    });
  }, []);

  const nameAssigned = (name: string) => {
    setName(name);
    setHasName(true);
  }

  return (
    <div>
      {!hasName && <NameForm socket={socket} nameAssigned={nameAssigned}/>}
      {hasName && <Game socket={socket}/>}
    </div>
  );
}

export default App;
