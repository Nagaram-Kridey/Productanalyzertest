import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import { motion } from 'framer-motion';

import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AnalyzePage from './pages/AnalyzePage';
import ResultsPage from './pages/ResultsPage';
import HistoryPage from './pages/HistoryPage';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/analyze" element={<AnalyzePage />} />
            <Route path="/results/:sessionId" element={<ResultsPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </motion.div>
      </Container>
    </Box>
  );
}

export default App;