import React from 'react';
import { Plus, MessageSquare, Trash2, Sun, Moon, Settings, X, MessageCircle } from 'lucide-react';
import { SidebarProps } from '../types';

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  toggleSidebar, 
  onNewChat, 
  chatHistory,
  currentChatId,
  onSelectChat,
  onDeleteChat,
  isDarkMode,
  toggleTheme,
  onOpenSettings
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      />

      {/* Sidebar Container */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-40
        w-[85%] md:w-72 max-w-[320px] 
        bg-surface md:bg-black border-r border-border md:border-zinc-900 
        transform transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
        flex flex-col dark:bg-black h-full
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        
        {/* Mobile Header with Close Button */}
        <div className="flex md:hidden items-center justify-between p-4 border-b border-border dark:border-zinc-900">
            <span className="font-bold text-lg text-zinc-900 dark:text-white">Menu</span>
            <button 
                onClick={toggleSidebar}
                className="p-2 -mr-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white rounded-lg transition-colors"
            >
                <X size={20} />
            </button>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button 
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 768) toggleSidebar();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-border dark:border-zinc-800 rounded-xl text-sm font-medium text-zinc-900 dark:text-white transition-all active:scale-[0.98] shadow-sm"
          >
            <div className="bg-zinc-100 dark:bg-zinc-800 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 p-1 rounded-md transition-colors">
              <Plus size={16} />
            </div>
            New Chat
          </button>
        </div>

        {/* Chat History List */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 scrollbar-hide">
          {chatHistory.length === 0 ? (
            <div className="px-4 py-8 text-center flex flex-col items-center justify-center h-40">
                <div className="w-12 h-12 mb-3 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center">
                    <MessageCircle size={20} className="text-zinc-400" />
                </div>
                <p className="text-xs text-zinc-500">No chat history yet.</p>
            </div>
          ) : (
             <>
               <div className="px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Recent
              </div>
              {chatHistory.map((chat) => (
                <div key={chat.id} className="group relative">
                  <button 
                    onClick={() => {
                      onSelectChat(chat.id);
                      if (window.innerWidth < 768) toggleSidebar();
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-colors active:scale-[0.99] ${
                      currentChatId === chat.id 
                        ? 'bg-zinc-200 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200 font-medium' 
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/50'
                    }`}
                  >
                    <MessageSquare size={16} className={`flex-shrink-0 ${currentChatId === chat.id ? "text-primary" : "text-zinc-400"}`} />
                    <span className="truncate pr-6 text-left">{chat.title || "New Chat"}</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(chat.id);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md text-zinc-400 hover:text-red-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                    title="Delete chat"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
             </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border dark:border-zinc-900 space-y-1 pb-[env(safe-area-inset-bottom)]">
          <button 
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 text-sm text-zinc-600 dark:text-zinc-400 transition-colors active:bg-zinc-200 dark:active:bg-zinc-800"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          
          <button 
            onClick={() => {
              onOpenSettings();
              if (window.innerWidth < 768) toggleSidebar();
            }}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 text-sm text-zinc-600 dark:text-zinc-400 transition-colors active:bg-zinc-200 dark:active:bg-zinc-800"
          >
            <Settings size={18} />
            Settings
          </button>
        </div>
      </div>
    </>
  );
};