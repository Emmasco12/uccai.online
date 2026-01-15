import React from 'react';
import ReactMarkdown from 'react-markdown';
import { User, Bot, Copy, Check } from 'lucide-react';
import { Message } from '../types';
import { formatTime } from '../utils/helpers';

interface ChatMessageProps {
  message: Message;
}

const CodeBlock = ({ children, className }: { children?: React.ReactNode; className?: string }) => {
  const [copied, setCopied] = React.useState(false);
  const codeContent = String(children || '').replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(codeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : 'text';

  return (
    <div className="relative group my-4 rounded-lg overflow-hidden bg-zinc-900 dark:bg-zinc-950 border border-zinc-800">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-800 dark:bg-zinc-900 border-b border-zinc-700 dark:border-zinc-800">
        <span className="text-xs text-zinc-400 font-mono">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors p-1"
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="p-3 md:p-4 overflow-x-auto">
        <code className={`font-mono text-xs md:text-sm text-zinc-100 ${className}`}>
          {children}
        </code>
      </div>
    </div>
  );
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const isError = message.isError;

  return (
    <div className={`flex gap-3 md:gap-4 w-full max-w-4xl mx-auto px-4 py-4 md:p-6 ${isUser ? 'bg-transparent' : 'bg-transparent'}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser ? 'bg-zinc-200 dark:bg-zinc-700' : isError ? 'bg-red-100 dark:bg-red-900/50' : 'bg-primary'
      }`}>
        {isUser ? <User size={16} className="text-zinc-600 dark:text-zinc-300" /> : <Bot size={16} className="text-white" />}
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-200">
            {isUser ? 'You' : 'UCCAI'}
          </span>
          <span className="text-[10px] md:text-xs text-zinc-500">
            {formatTime(message.timestamp)}
          </span>
        </div>

        <div className={`prose prose-zinc dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-transparent max-w-none text-sm md:text-base text-zinc-800 dark:text-zinc-300 ${isError ? 'text-red-500 dark:text-red-400' : ''}`}>
           {/* If message is empty and streaming, show a blinking cursor */}
           {message.isStreaming && message.content === '' ? (
             <span className="inline-block w-2 h-4 bg-zinc-500 animate-pulse align-middle" />
           ) : (
            <ReactMarkdown
              components={{
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const isInline = !match && !String(children).includes('\n');
                  
                  if (isInline) {
                    return (
                      <code className="bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-1.5 py-0.5 rounded text-xs md:text-sm font-mono border border-zinc-200 dark:border-zinc-700" {...props}>
                        {children}
                      </code>
                    );
                  }

                  return (
                    <CodeBlock className={className}>
                      {children}
                    </CodeBlock>
                  );
                }
              }}
            >
              {message.content + (message.isStreaming ? ' ▍' : '')}
            </ReactMarkdown>
           )}
        </div>
      </div>
    </div>
  );
};