// src/context/NotificationContext.js
import React, { createContext, useState, useCallback } from 'react';

export const NotificationContext = createContext({
  notification: null,
  showNotification: () => {},
  hideNotification: () => {},
});

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const showNotification = useCallback((message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      hideNotification();
    }, 4000); // 4초 후에 자동으로 사라짐
  }, [hideNotification]);

  return (
    <NotificationContext.Provider value={{ notification, showNotification, hideNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};