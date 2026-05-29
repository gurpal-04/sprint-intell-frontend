import React, { useState } from 'react';
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


export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView setActiveTab={setActiveTab} />;
      case 'insights':
        return <SprintInsightsView />;
      case 'coral-sql':
        return <CoralConsoleView />;
      case 'risks':
        return <RiskAnalysisView />;

      case 'workload':
        return <TeamWorkloadView />;
      case 'chat':
        return <AIChatView />;
      case 'timeline':
        return <TimelineView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView setActiveTab={setActiveTab} />;
    }
  };

  return (
    <SprintProvider>
      <div className="flex bg-background min-h-screen text-gray-100 font-sans overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Outer Layout Context */}
        <div className="flex-1 pl-64 flex flex-col min-h-screen">
          {/* Global Header */}
          <Header />

          {/* Subpage Container */}
          <main className="flex-1 p-8 mt-20 overflow-y-auto max-h-[calc(100vh-80px)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                {renderActiveTab()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </SprintProvider>
  );
}
