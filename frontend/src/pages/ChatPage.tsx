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
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center">C</div>
          <span className="ml-2 text-lg font-semibold">Convoai</span>
        </div>
        <span className="text-green-500">● Online</span>
      </header>
      <div className="flex-grow flex flex-col items-center justify-center text-center">
        <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-full p-4 mb-4">
          <span className="text-white text-2xl">💬</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">Welcome to Convoai</h1>
        <p className="mb-4">Start a conversation and earn TON tokens with every message. Ask me anything!</p>
        <div className="space-y-2">
          <button className="w-full py-2 px-4 border rounded-lg">What is blockchain technology?</button>
          <button className="w-full py-2 px-4 border rounded-lg">Explain artificial intelligence</button>
          <button className="w-full py-2 px-4 border rounded-lg">How does cryptocurrency work?</button>
          <button className="w-full py-2 px-4 border rounded-lg">Tell me about TON blockchain</button>
        </div>
      </div>
      <nav className="fixed bottom-0 w-full bg-white border-t flex justify-around p-2">
        <button className="flex flex-col items-center text-blue-500">
          <span>🔍</span>
          <span className="text-xs">Chat</span>
        </button>
        <button className="flex flex-col items-center">
          <span>📊</span>
          <span className="text-xs">Dashboard</span>
        </button>
        <button className="flex flex-col items-center">
          <span>📤</span>
          <span className="text-xs">Withdraw</span>
        </button>
        <button className="flex flex-col items-center">
          <span>🕒</span>
          <span className="text-xs">History</span>
        </button>
      </nav>
      <div className="chat-messages flex-grow overflow-y-auto p-2 sm:p-4 md:p-6 space-y-3 pb-40">
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