import React from 'react';
import './App.css';
import io from 'socket.io-client';
import Sidebar from './Sidebar';

const socket = io('http://localhost:8000');

window.sendMessage = (message) => {
  socket.emit('chat message', message);
}

function App() {
  return (
    <div className="App">
      <Sidebar />
    </div>
  );
}

export default App;
