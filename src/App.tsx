import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { io } from 'socket.io-client'
const socket = io('http://localhost:3000');

function App() {

  const [serverMessage, setServerMessage] = useState("");

  useEffect(() => {
    socket.on('alert message', (message: string) => {
      console.log(message);
      setServerMessage(message);
    });

    return () => {
      socket.emit("disonnecting");
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {serverMessage}
        </p>
      </header>
    </div>
  );
}

export default App;
