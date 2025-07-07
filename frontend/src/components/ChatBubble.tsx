import React from 'react';
import { motion } from 'framer-motion';

interface ChatBubbleProps {
  role: 'user' | 'bot';
  text: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ role, text }) => {
  const baseStyle = 'max-w-[87%] px-4 py-2 rounded-2xl shadow transition-opacity duration-150';
  const userStyle = 'ml-auto bg-blue-500 text-white rounded-br-sm';
  const botStyle = 'mr-auto bg-gray-300 text-black rounded-bl-sm';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`${baseStyle} ${role === 'user' ? userStyle : botStyle}`}
    >
      {text}
    </motion.div>
  );
};

export default ChatBubble; 