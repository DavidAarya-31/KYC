import React from 'react';

const NotificationBanner: React.FC = () => {
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
      {/* Notification message will go here */}
      <span className="font-medium">Notification:</span> You are close to your budget limit!
    </div>
  );
};

export default NotificationBanner; 