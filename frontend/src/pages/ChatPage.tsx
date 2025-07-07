import { useState, useRef, useEffect } from 'react';
import ChatBubble from '../components/ChatBubble';
import ChatInput from '../components/ChatInput';
import Toast from '../components/Toast';

const ChatPage = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const chatEndRef = useRef<null | HTMLDivElement>(null);

  const handleSend = (message: string) => {
    setMessages([...messages, { role: 'user', text: message }]);
    // Simulate bot response
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'bot', text: 'This is a bot response.' }]);
      setToastMessage('+0.05 TON Earned');
    }, 1000);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-page flex flex-col h-full bg-white dark:bg-gray-900 sm:p-4 md:p-6 lg:p-8">
      <div className="chat-messages flex-grow overflow-y-auto p-2 sm:p-4 md:p-6 space-y-3">
        {messages.map((msg, index) => (
          <ChatBubble key={index} role={msg.role} text={msg.text} />
        ))}
        <div ref={chatEndRef} />
      </div>
      <ChatInput onSend={handleSend} />
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
};

export default ChatPage; 