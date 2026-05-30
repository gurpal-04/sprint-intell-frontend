import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { SprintProvider } from './context/SprintContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import SprintInsightsView from './components/SprintInsightsView';
import RiskAnalysisView from './components/RiskAnalysisView';
import TeamWorkloadView from './components/TeamWorkloadView';
import AIChatView from './components/AIChatView';
import TimelineView from './components/TimelineView';
import SettingsView from './components/SettingsView';
import CoralConsoleView from './components/CoralConsoleView';
import { motion, AnimatePresence } from 'framer-motion';

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.25, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active tab from path (default: 'dashboard')
  const pathToken = location.pathname.substring(1);
  const activeTab = pathToken || 'dashboard';

  const handleTabChange = (tabId) => {
    navigate(tabId === 'dashboard' ? '/' : `/${tabId}`);
  };

  return (
    <SprintProvider>
      <div className="flex bg-background min-h-screen text-gray-100 font-sans overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />

        {/* Outer Layout Context */}
        <div className="flex-1 pl-64 flex flex-col min-h-screen">
          {/* Global Header */}
          <Header />

          {/* Subpage Container */}
          <main className="flex-1 p-8 mt-20 overflow-y-auto max-h-[calc(100vh-80px)]">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageWrapper><DashboardView setActiveTab={handleTabChange} /></PageWrapper>} />
                <Route path="/dashboard" element={<Navigate to="/" replace />} />
                <Route path="/insights" element={<PageWrapper><SprintInsightsView /></PageWrapper>} />
                <Route path="/coral-sql" element={<PageWrapper><CoralConsoleView /></PageWrapper>} />
                <Route path="/risks" element={<PageWrapper><RiskAnalysisView /></PageWrapper>} />
                <Route path="/workload" element={<PageWrapper><TeamWorkloadView /></PageWrapper>} />
                <Route path="/chat" element={<PageWrapper><AIChatView /></PageWrapper>} />
                <Route path="/timeline" element={<PageWrapper><TimelineView /></PageWrapper>} />
                <Route path="/settings" element={<PageWrapper><SettingsView /></PageWrapper>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </SprintProvider>
  );
}
