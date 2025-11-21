import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppContent from './AppContent';
import { NotificationProvider } from './context/NotificationContext';

function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </BrowserRouter>
  );
}

export default App;