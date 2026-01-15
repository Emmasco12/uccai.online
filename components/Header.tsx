import React from 'react';
import { Menu, Sparkles } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/80 backdrop-blur-md border-b border-border dark:border-zinc-900/50 transition-colors">
      <div className="flex items-center justify-between px-4 h-16 max-w-4xl mx-auto w-full md:px-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleSidebar}
            className="p-2 -ml-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg md:hidden transition-colors"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Sparkles size={18} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-white">
              UCCAI
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
              BETA
            </span>
          </div>
        </div>
        
        <div className="flex items-center">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Gemini 3 Flash</span>
            </div>
        </div>
      </div>
    </header>
  );
};