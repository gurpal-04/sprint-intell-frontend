import React, { useState } from 'react';
import { useSprint } from '../context/SprintContext';
import { 
  BookOpen,
  Terminal,
  Copy,
  Check,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function StandupSynthesizer({ isFullScreen = false }) {
  const { 
    standupText, 
    standupLoading, 
    triggerStandupGeneration,
    resolveSlackMentions
  } = useSprint();

  const [copiedText, setCopiedText] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
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
    <div className={`glass-card rounded-2xl p-6 border border-border flex flex-col justify-between overflow-hidden ${
      isFullScreen ? 'h-[calc(100vh-140px)]' : 'h-full'
    }`}>
      <div className="space-y-4 flex-1 overflow-y-auto">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5 font-sans">
              <BookOpen className="w-4 h-4 text-purple-400" />
              Standup Synthesizer
            </h3>
            <p className="text-[11px] text-slate-400">Synthesize formatted team standup reports dynamically.</p>
          </div>
          <button 
            onClick={triggerStandupGeneration}
            disabled={standupLoading}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-indigo-500/25 disabled:opacity-50 transition-all"
            title="Regenerate Report"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${standupLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {standupLoading ? (
          <div className="py-20 space-y-4 flex flex-col items-center justify-center animate-pulse">
            <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
            <span className="text-xs text-slate-500 font-mono">Synthesizing logs...</span>
          </div>
        ) : standupText ? (
          <div className="space-y-3 p-4 bg-slate-950/45 rounded-xl border border-slate-900 font-mono text-[11px] text-slate-300 leading-relaxed overflow-y-auto max-h-[calc(100vh-300px)]">
            {renderMarkdown(standupText)}
          </div>
        ) : (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
              <Terminal className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-semibold text-slate-300">No Standup Generated</h4>
            <p className="text-[10px] text-slate-500 max-w-[200px]">Click below to query Coral indices and synthesize a sprint standup draft.</p>
          </div>
        )}
      </div>

      {standupText && (
        <button 
          onClick={() => handleCopy(standupText)}
          className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-sm"
        >
          {copiedText ? (
            <>
              <Check className="w-4 h-4" />
              <span>Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Standup Script</span>
            </>
          )}
        </button>
      )}

      {!standupText && (
        <button 
          onClick={triggerStandupGeneration}
          disabled={standupLoading}
          className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 hover:border-indigo-500/25 text-slate-200 transition-all shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Generate Standup Report</span>
        </button>
      )}
    </div>
  );
}
