// src/components/Notification.js
import React, { useContext} from 'react';
import { NotificationContext } from '../context/NotificationContext';

function Notification() {
  const { notification, hideNotification } = useContext(NotificationContext);

  if (!notification) {
    return null;
  }

  return (
    <div className={`notification ${notification.type} show`}>
      {notification.message}
      <button onClick={hideNotification} className="close-btn">&times;</button>
    </div>
  );
}

export default Notification;
