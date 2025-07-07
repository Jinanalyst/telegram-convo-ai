import { useState } from 'react';
import ChatBubble from '../components/ChatBubble';
import ChatInput from '../components/ChatInput';
import Toast from '../components/Toast';

const ChatPage = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSend = (message: string) => {
    setMessages([...messages, { role: 'user', text: message }]);
    // Simulate bot response
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'bot', text: 'This is a bot response.' }]);
      setToastMessage('+0.05 TON Earned');
    }, 1000);
  };

  return (
    <div className="chat-page flex flex-col h-full">
      <div className="chat-messages flex-grow overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => (
          <ChatBubble key={index} role={msg.role} text={msg.text} />
        ))}
      </div>
      <ChatInput onSend={handleSend} />
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
};

export default ChatPage; 