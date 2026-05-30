import React, { useState, useRef, useEffect } from 'react';
import { useSprint } from '../context/SprintContext';
import { 
  Send, 
  Sparkles, 
  User, 
  Terminal,
  Link2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function AIChatPanel() {
  const { 
    chatMessages, 
    chatLoading, 
    askAIChat, 
    setChatMessages,
    resolveSlackMentions
  } = useSprint();

  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  // Quick Action Chips
  const actionChips = [
    { label: "What is status of current sprint?", query: "What is status of current sprint?" },
    { label: "Who is overloaded?", query: "Who is overloaded with tasks and reviews?" },
    { label: "Detect silent blockers", query: "Detect silent blockers or stale tasks in progress." }
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages, chatLoading]);

  // Initial welcome message if history is empty
  useEffect(() => {
    if (chatMessages.length === 0) {
      setChatMessages([
        {
          id: 'welcome',
          sender: 'ai',
          text: `### 🤖 Sprint Operations Intelligence Agent

I am your contextual engineering operations partner. I retrieve real-time documents from **Linear**, **GitHub**, and **Slack** using the **Coral Retrieval Layer** to answer queries regarding delivery health, blockers, and workloads.

**How can I help you today?** You can type a question, select a prompt chip below, or click the **Standup Synthesizer** badge on the right!`,
          time: new Date()
        }
      ]);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || chatLoading) return;
    askAIChat(input);
    setInput('');
  };

  const renderMarkdown = (text) => {
    if (!text) return null;
    const resolved = resolveSlackMentions(text);
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        className="prose prose-sm max-w-none text-slate-300"
        components={{
          h3: ({node, ...props}) => <h3 className="text-sm font-bold text-white mt-4 mb-2 flex items-center gap-1.5" {...props} />, 
          h4: ({node, ...props}) => <h4 className="text-xs font-bold text-indigo-300 mt-3 mb-1" {...props} />, 
          blockquote: ({node, ...props}) => (
            <div className="my-2.5 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-indigo-300 text-xs italic font-medium leading-relaxed" {...props} />
          ),
          li: ({node, ordered, ...props}) => (
            <li className="text-xs text-slate-300 ml-4 list-disc py-0.5 leading-relaxed" {...props} />
          ),
          table: ({node, ...props}) => (
            <div className="overflow-x-auto my-2"><table className="border-collapse border border-slate-700" {...props} /></div>
          ),
          th: ({node, ...props}) => (
            <th className="px-2 py-1 border border-slate-600 bg-slate-800 font-bold text-slate-200" {...props} />
          ),
          td: ({node, ...props}) => (
            <td className="px-2 py-1 border border-slate-600 text-slate-300" {...props} />
          ),
          p: ({node, ...props}) => (
            <p className="text-xs text-slate-300 leading-relaxed my-1 font-sans" {...props} />
          )
        }}
      >
        {resolved}
      </ReactMarkdown>
    );
  };

  return (
    <div className="glass-card rounded-2xl flex flex-col justify-between overflow-hidden border border-border h-full relative">
      
      {/* Chat History Container */}
      <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-5">
        {chatMessages.map((msg) => {
          const isAI = msg.sender === 'ai';
          return (
            <div 
              key={msg.id} 
              className={`flex gap-3.5 items-start ${isAI ? 'justify-start' : 'justify-end'}`}
            >
              {isAI && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md neon-glow-indigo mt-1">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}

              <div className="max-w-[85%] space-y-2">
                <div className={`p-4 rounded-2xl shadow-sm text-xs ${
                  isAI 
                    ? 'bg-slate-900/50 border border-slate-800/80 text-slate-300 rounded-tl-sm' 
                    : 'bg-indigo-600 text-white rounded-tr-sm ml-auto'
                }`}>
                   {/* Render AI response as Markdown */}
                   <div className="space-y-1">
                     {isAI ? renderMarkdown(msg.text) : <p className="leading-relaxed font-sans">{msg.text}</p>}
                   </div>

                  {/* Mode tag */}
                  {isAI && msg.mode && (
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800/60 text-[9px] text-slate-500 font-mono">
                      <span className="flex items-center gap-1">
                        <Terminal className="w-3 h-3 text-indigo-400" />
                        {msg.mode}
                      </span>
                      <span>Citations: {msg.citations?.length || 0} docs</span>
                    </div>
                  )}
                </div>

                {/* CITED CORAL SOURCES DRAWER */}
                {isAI && msg.citations && msg.citations.length > 0 && (
                  <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-900/60 max-w-full space-y-2">
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">
                      Coral Context Sources Explored ({msg.citations.length})
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {msg.citations.map((doc, idx) => (
                        <div 
                          key={idx} 
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-mono shadow-sm"
                          title={`Relevance: ${doc.relevance || 1.0}`}
                        >
                          <Link2 className="w-3 h-3 text-indigo-400" />
                          <span className="font-bold text-slate-400">{doc.source}:</span>
                          <span>{doc.id}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {!isAI && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-4 h-4 text-slate-400" />
                </div>
              )}
            </div>
          );
        })}

        {/* SKELETON LOADER BULB */}
        {chatLoading && (
          <div className="flex gap-3.5 items-start justify-start">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 animate-pulse mt-1">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="max-w-[70%] space-y-2">
              <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 rounded-tl-sm w-64 space-y-2 shadow-sm skeleton-shimmer">
                <div className="h-3 w-3/4 bg-slate-800/60 rounded"></div>
                <div className="h-3 w-5/6 bg-slate-800/60 rounded"></div>
                <div className="h-3 w-1/2 bg-slate-800/60 rounded"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Panel & Suggestion Chips */}
      <div className="p-4 border-t border-border bg-slate-950/20 space-y-3.5">
        {/* Action Prompt Chips */}
        <div className="flex flex-wrap gap-2">
          {actionChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => askAIChat(chip.query)}
              disabled={chatLoading}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800/80 text-[10px] text-slate-400 font-semibold tracking-wide hover:border-indigo-500/25 hover:text-slate-200 transition-all shadow-sm"
            >
              {chip.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about sprint delays, review bottlenecks, or staging issues..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900/55 border border-slate-800/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/40 transition-all font-sans"
            disabled={chatLoading}
          />
          <button 
            type="submit"
            disabled={chatLoading || !input.trim()}
            className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-500 transition-all disabled:opacity-50 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
