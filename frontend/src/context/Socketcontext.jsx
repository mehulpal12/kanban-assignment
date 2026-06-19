import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

// Create the socket OUTSIDE the component lifecycle so StrictMode's
// mount → unmount → mount cycle in dev doesn't tear down a connection
// that's still mid-handshake.
const socket = io('http://localhost:5000', {
  transports: ['websocket', 'polling'],
  autoConnect: false, // we control when it connects
});

export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    if (!socket.connected) {
      socket.connect();
    }

    // Cleanup only removes OUR listeners — it does NOT disconnect the
    // shared socket, so StrictMode's extra mount/unmount cycle is safe.
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket must be used within a SocketProvider');
  return context;
};