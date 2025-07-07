import React, { useState } from 'react';

const ChatInput: React.FC<{ onSend: (message: string) => void }> = ({ onSend }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <div className="chat-input fixed bottom-16 w-full flex items-center p-2 bg-white dark:bg-gray-800 shadow-md max-w-md mx-auto left-1/2 transform -translate-x-1/2 z-20">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-grow p-2 rounded-full border border-gray-300 focus:outline-none"
        placeholder="Type a message..."
      />
      <button
        onClick={handleSend}
        className="ml-2 p-2 bg-accent text-white rounded-full shadow-md hover:bg-accent-dark"
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput; 