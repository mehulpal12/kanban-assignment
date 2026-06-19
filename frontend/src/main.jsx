import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { SocketProvider } from './context/Socketcontext.jsx';
import { BoardProvider } from './context/BoardContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SocketProvider>
      <BoardProvider>
        <App />
      </BoardProvider>
    </SocketProvider>
  </React.StrictMode>
);