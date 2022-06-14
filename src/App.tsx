import React, { useEffect, useState } from 'react';
import NameForm from "./components/NameForm/NameForm";
import Game from "./components/Game/Game"
import './App.css';
import { io } from 'socket.io-client'
const socket = io('http://localhost:3000');

function App() {

  const [serverMessage, setServerMessage] = useState("");
  const [hasName, setHasName] = useState(false);

  useEffect(() => {
    socket.on('alert message', (message: string) => {
      console.log(message);
      setServerMessage(message);
    });
  }, []);

  return (
    <div>
      {!hasName && <NameForm socket={socket}/>}
      {hasName && <Game />}
    </div>
  );
}

export default App;
