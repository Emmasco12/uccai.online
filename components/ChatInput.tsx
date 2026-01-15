import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || disabled) return;
    
    onSend(input);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  return (
    <div className="w-full max-w-4xl mx-auto px-3 pb-3 pt-2 md:p-4 pb-[calc(12px+env(safe-area-inset-bottom))]">
      <div className="relative flex items-end gap-2 bg-surface rounded-2xl border border-border dark:border-zinc-800 p-2 shadow-lg ring-1 ring-black/5 dark:ring-white/5 focus-within:ring-primary/50 transition-all">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message UCCAI..."
          rows={1}
          disabled={disabled}
          className="flex-1 bg-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 resize-none outline-none max-h-[160px] md:max-h-[200px] p-2.5 md:p-3 text-[16px] md:text-base leading-relaxed overflow-y-auto min-h-[44px]"
          style={{ scrollbarWidth: 'none' }}
        />
        
        <button
          onClick={() => handleSubmit()}
          disabled={!input.trim() || disabled}
          className={`p-2.5 md:p-3 rounded-xl mb-0.5 flex-shrink-0 transition-all duration-200 active:scale-95 ${
            input.trim() && !disabled
              ? 'bg-primary text-white hover:bg-primaryHover shadow-md shadow-indigo-500/20' 
              : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed'
          }`}
        >
          {disabled ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
        </button>
      </div>
      <p className="hidden md:block text-center text-xs text-zinc-500 dark:text-zinc-600 mt-3">
        UCCAI can make mistakes. Please check important information.
      </p>
    </div>
  );
};