import { useState, useEffect } from "react";

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowNotification(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showNotification && isOnline) return null;

  return (
    <div
      className={`fixed top-20 left-4 right-4 z-50 p-3 rounded-lg shadow-lg transition-all duration-300 ${
        isOnline
          ? 'bg-green-500 text-white'
          : 'bg-orange-500 text-white'
      }`}
    >
      <div className="flex items-center space-x-2">
        <i className={`fas ${isOnline ? 'fa-wifi' : 'fa-wifi-slash'}`}></i>
        <span className="font-medium">
          {isOnline ? 'Back Online' : 'Working Offline'}
        </span>
        <span className="text-sm">
          {isOnline ? 'Data will sync automatically' : 'Your progress is saved locally'}
        </span>
      </div>
    </div>
  );
}