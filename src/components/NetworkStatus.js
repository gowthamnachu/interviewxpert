import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div>
      {isOnline ? (
        <p>Online</p>
      ) : (
        <p>
          <FaExclamationTriangle /> Offline
        </p>
      )}
    </div>
  );
};

export default NetworkStatus;