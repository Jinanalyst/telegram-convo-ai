import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import ChatPage from './pages/ChatPage';
import DashboardPage from './pages/DashboardPage';
import WithdrawPage from './pages/WithdrawPage';
import DepositsPage from './pages/DepositsPage';
import ThemeToggle from './components/ThemeToggle';
import './App.css'

function App() {
  const location = useLocation();

  return (
    <Router>
      <div className="app-container">
        <ThemeToggle />
        <AnimatePresence exitBeforeEnter>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><ChatPage /></motion.div>} />
            <Route path="/dashboard" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><DashboardPage /></motion.div>} />
            <Route path="/withdraw" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><WithdrawPage /></motion.div>} />
            <Route path="/deposits" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><DepositsPage /></motion.div>} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;
