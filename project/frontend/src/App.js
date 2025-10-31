import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import HeimdallDashboard from './pages/HeimdallDashboard';
import VaultDashboard from './pages/VaultDashboard';
import PrivacyDashboard from './pages/PrivacyDashboard';
import PhalanxTraining from './pages/PhalanxTraining';
import SentryControl from './pages/SentryControl';
import PhishingAnalyzer from './pages/PhishingAnalyzer';
import './index.css';

function App() {
  return (
    <ErrorBoundary>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="heimdall" element={<HeimdallDashboard />} />
              <Route path="vault" element={<VaultDashboard />} />
              <Route path="privacy" element={<PrivacyDashboard />} />
              <Route path="training" element={<PhalanxTraining />} />
              <Route path="sentry" element={<SentryControl />} />
              <Route path="phishing" element={<PhishingAnalyzer />} />
            </Route>
          </Routes>
        </Router>
      </UserProvider>
    </ErrorBoundary>
  );
}

export default App;