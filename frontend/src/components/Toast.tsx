import React from 'react';
import { motion } from 'framer-motion';

interface ToastProps {
  message: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="toast fixed bottom-16 right-4 bg-accent text-white p-3 rounded-lg shadow-lg"
    >
      {message}
      <button onClick={onClose} className="ml-2 text-sm underline">
        Close
      </button>
    </motion.div>
  );
};

export default Toast; 