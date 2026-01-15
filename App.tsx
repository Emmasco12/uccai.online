import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatInput } from './components/ChatInput';
import { ChatMessage } from './components/ChatMessage';
import { Header } from './components/Header';
import { SettingsModal } from './components/SettingsModal';
import { Message, ChatSession } from './types';
import { initializeChat, sendMessageStream } from './services/api';
import { generateId, saveChatsToStorage, getChatsFromStorage } from './utils/helpers';
import { Sparkles } from 'lucide-react';

const MODEL_NAME = 'gemini-3-flash-preview';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // History State
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  // Load History and Theme on Mount
  useEffect(() => {
    const savedChats = getChatsFromStorage();
    setChatHistory(savedChats);
    
    // Check theme
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);

    if (!initializedRef.current) {
      // Start a fresh session internally, but don't create a history entry yet until they type
      initializeChat({ model: MODEL_NAME });
      initializedRef.current = true;
    }
  }, []);

  // Save history whenever it changes
  useEffect(() => {
    saveChatsToStorage(chatHistory);
  }, [chatHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleTheme = () => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
      if (metaThemeColor) metaThemeColor.setAttribute('content', '#ffffff');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
      if (metaThemeColor) metaThemeColor.setAttribute('content', '#000000');
    }
  };

  const startNewChat = () => {
    setCurrentChatId(null);
    setMessages([]);
    setIsStreaming(false);
    initializeChat({ model: MODEL_NAME }); // Reset Gemini session
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const loadChat = (id: string) => {
    const chat = chatHistory.find(c => c.id === id);
    if (!chat) return;

    setCurrentChatId(id);
    setMessages(chat.messages);
    setIsStreaming(false);
    
    // Re-initialize Gemini session with history
    const historyForGemini = chat.messages
      .filter(m => !m.isError)
      .map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));
    
    initializeChat({ 
      model: MODEL_NAME,
      history: historyForGemini
    });
  };

  const deleteChat = (id: string) => {
    setChatHistory(prev => prev.filter(c => c.id !== id));
    if (currentChatId === id) {
      startNewChat();
    }
  };

  const clearAllHistory = () => {
    setChatHistory([]);
    startNewChat();
    setIsSettingsOpen(false);
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isStreaming) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: Date.now(),
    };

    let newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsStreaming(true);

    // Handle History Creation/Update logic *before* streaming starts if it's a new chat
    let activeId = currentChatId;
    
    if (!activeId) {
      activeId = generateId();
      setCurrentChatId(activeId);
      
      const newSession: ChatSession = {
        id: activeId,
        title: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
        messages: newMessages,
        createdAt: Date.now()
      };
      
      setChatHistory(prev => [newSession, ...prev]);
    } else {
        // Update existing session
        setChatHistory(prev => prev.map(chat => 
            chat.id === activeId 
                ? { ...chat, messages: newMessages }
                : chat
        ));
    }

    const botMessageId = generateId();
    
    setMessages((prev) => [
      ...prev,
      {
        id: botMessageId,
        role: 'model',
        content: '',
        timestamp: Date.now(),
        isStreaming: true,
      },
    ]);

    try {
      const stream = sendMessageStream(content);
      let accumulatedText = '';

      for await (const chunk of stream) {
        accumulatedText += chunk;
        
        // Update local state
        setMessages((prev) => {
            const updated = prev.map((msg) => 
                msg.id === botMessageId 
                ? { ...msg, content: accumulatedText }
                : msg
            );
            return updated;
        });
      }

      // Finish streaming & Final Save to History
      const finalBotMessage: Message = {
        id: botMessageId,
        role: 'model',
        content: accumulatedText,
        timestamp: Date.now(),
        isStreaming: false
      };

      setMessages(prev => prev.map(msg => msg.id === botMessageId ? finalBotMessage : msg));

      // Update history with the complete bot response
      setChatHistory(prev => prev.map(chat => {
        if (chat.id === activeId) {
            // Reconstruct messages array with the final bot message
            // We use the messages we know we added: existing + user + bot
            // This is safer than relying on closure state of 'messages' which might be stale
            
            // Find the current chat to get up-to-date messages minus the placeholder
            const currentChatMessages = chat.messages; // This has user message already from above
            return {
                ...chat,
                messages: [...currentChatMessages, finalBotMessage] 
            };
        }
        return chat;
      }));

    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = "Sorry, I encountered an error. Please try again.";
      
      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === botMessageId 
            ? { ...msg, isStreaming: false, isError: true, content: errorMessage }
            : msg
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="flex h-screen bg-background text-zinc-900 dark:text-zinc-100 overflow-hidden transition-colors duration-200">
      
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        onNewChat={startNewChat}
        chatHistory={chatHistory}
        currentChatId={currentChatId}
        onSelectChat={loadChat}
        onDeleteChat={deleteChat}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative w-full h-full min-w-0">
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Chat Messages Area */}
        <main className="flex-1 overflow-y-auto scroll-smooth">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-4 md:p-8 text-center space-y-4 md:space-y-6">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/10 mb-2 md:mb-4 ring-1 ring-zinc-200 dark:ring-zinc-800">
                <Sparkles size={28} className="text-primary" />
              </div>
              <h1 className="text-2xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400">
                How can I help you?
              </h1>
              <p className="text-sm md:text-base text-zinc-500 max-w-md px-4">
                I'm UCCAI. Ask me anything about coding, analysis, or creative writing.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl mt-8 px-2">
                 <button onClick={() => handleSendMessage("Write a Python script to scrape a website")} className="p-4 rounded-xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-left shadow-sm active:scale-[0.98] duration-150">
                    <span className="font-semibold text-zinc-800 dark:text-zinc-300 block mb-1 text-sm md:text-base">Python Scripting</span>
                    <span className="text-xs text-zinc-500">Scrape website data securely</span>
                 </button>
                 <button onClick={() => handleSendMessage("Explain Quantum Entanglement like I'm 5")} className="p-4 rounded-xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-left shadow-sm active:scale-[0.98] duration-150">
                    <span className="font-semibold text-zinc-800 dark:text-zinc-300 block mb-1 text-sm md:text-base">Physics Concepts</span>
                    <span className="text-xs text-zinc-500">Simplify complex topics</span>
                 </button>
              </div>
            </div>
          ) : (
            <div className="pb-4 pt-2">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
        </main>

        {/* Sticky Input Area */}
        <div className="flex-shrink-0 bg-gradient-to-t from-background via-background to-transparent z-10">
          <ChatInput onSend={handleSendMessage} disabled={isStreaming} />
        </div>

        {/* Settings Modal */}
        <SettingsModal 
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onClearHistory={clearAllHistory}
        />

      </div>
    </div>
  );
}

export default App;