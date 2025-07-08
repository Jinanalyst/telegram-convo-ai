import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import ChatPage from './pages/ChatPage';
import DashboardPage from './pages/DashboardPage';
import WithdrawPage from './pages/WithdrawPage';
import DepositsPage from './pages/DepositsPage';
import ThemeToggle from './components/ThemeToggle';
import './App.css'

// Separate component so hooks stay within the Router context
const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><ChatPage /></motion.div>} />
        <Route path="/dashboard" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><DashboardPage /></motion.div>} />
        <Route path="/withdraw" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><WithdrawPage /></motion.div>} />
        <Route path="/deposits" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><DepositsPage /></motion.div>} />
        <Route path="/webapp" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><ChatPage /></motion.div>} />
        <Route path="/webapp/dashboard" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><DashboardPage /></motion.div>} />
        <Route path="/webapp/withdraw" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><WithdrawPage /></motion.div>} />
        <Route path="/webapp/deposits" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><DepositsPage /></motion.div>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <ThemeToggle />
        <AnimatedRoutes />
      </div>
    </Router>
  );
}

export default App;
