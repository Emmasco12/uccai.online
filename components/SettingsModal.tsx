import React from 'react';
import { X, Trash2, Monitor } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearHistory: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onClearHistory }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden transform transition-all scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Settings</h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          
          {/* General Info */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">General</h3>
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
               <div className="flex items-center gap-3">
                 <Monitor size={18} className="text-zinc-500" />
                 <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Model</span>
               </div>
               <span className="text-[10px] font-mono bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded-md text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700">Gemini 3 Flash</span>
            </div>
          </div>

          {/* Data Management */}
          <div className="space-y-2">
             <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Data & Storage</h3>
             <button 
               onClick={() => {
                 if(window.confirm('Are you sure you want to delete all chat history? This action cannot be undone.')) {
                   onClearHistory();
                 }
               }}
               className="w-full flex items-center justify-between p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/20 transition-all group"
             >
                <div className="flex items-center gap-3">
                  <Trash2 size={18} className="text-red-500" />
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">Clear All History</span>
                </div>
             </button>
             <p className="text-xs text-zinc-500 px-1">
               Permanently remove all chats from this device.
             </p>
          </div>
          
           {/* About */}
           <div className="space-y-2 pt-2">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">About</h3>
            <div className="p-3 text-sm text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-zinc-900 dark:text-zinc-200">UCCAI</span>
                <span className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full">v1.3.0</span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">
                An advanced AI assistant powered by Google's Gemini 3 Flash model. Built for speed and precision.
              </p>
            </div>
           </div>

        </div>
      </div>
    </div>
  );
};