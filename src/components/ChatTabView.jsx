import React, { useState } from 'react';
import { BookOpen, MessageSquare } from 'lucide-react';
import AIChatPanel from './AIChatPanel';
import StandupSynthesizer from './StandupSynthesizer';

export default function ChatTabView() {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'standup'

  return (
    <div className="flex gap-6 relative h-[calc(100vh-140px)]">
      {/* Main Content Area */}
      <div className="flex-1">
        {activeTab === 'chat' ? (
          <AIChatPanel />
        ) : (
          <StandupSynthesizer isFullScreen={true} />
        )}
      </div>

      {/* Action Cards on Right Side */}
      <div className={`flex flex-col gap-3 min-w-[120px] h-4 -rotate-90 absolute top-1/2 ${activeTab === 'chat' ? '-right-[52px]' : '-right-[52px]'}`}>
        <button
          onClick={() => activeTab === 'chat' ? setActiveTab('standup') : setActiveTab('chat')}
          className={`p-2 rounded-lg transition-all duration-300 gap-3 text-center bg-indigo-600 text-white shadow-lg border border-indigo-500`}
        >
            <p className="text-xs font-bold text-nowrap">{`${activeTab === 'standup' ? 'AI Chat' : 'Generate Report'}`}</p>
        </button>
      </div>
    </div>
  );
}
