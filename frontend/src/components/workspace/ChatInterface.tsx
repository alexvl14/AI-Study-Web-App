import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import api from '../../services/api';
import type { ChatHistoryResponse } from '../../types/notebook';
import { Sender } from '../../types/notebook';

interface ChatInterfaceProps {
  notebookId?: string;
  chatHistory: ChatHistoryResponse[];
  onMessageAdded: (msg: ChatHistoryResponse) => void;
  onOlderMessagesLoaded?: (msgs: ChatHistoryResponse[]) => void;
  onRefresh?: () => void;
}

export default function ChatInterface({ notebookId, chatHistory, onMessageAdded, onOlderMessagesLoaded, onRefresh }: ChatInterfaceProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const previousScrollHeightRef = useRef<number>(0);

  const sortedChat = [...chatHistory].sort((a, b) => 
    new Date(a.sendDateTime).getTime() - new Date(b.sendDateTime).getTime()
  );

  // Auto-scroll to bottom only when sending or when first loading
  useEffect(() => {
    if (!isLoadingMore) {
      endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory.length, isSending]);

  // Click outside to close attachment menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Adjust scroll position when older messages are loaded
  useLayoutEffect(() => {
    if (isLoadingMore && chatContainerRef.current && previousScrollHeightRef.current > 0) {
      const newScrollHeight = chatContainerRef.current.scrollHeight;
      chatContainerRef.current.scrollTop = newScrollHeight - previousScrollHeightRef.current;
      previousScrollHeightRef.current = 0; // Reset
    }
  }, [chatHistory.length]);

  const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (target.scrollTop === 0 && !isLoadingMore && hasMore && sortedChat.length > 0 && onOlderMessagesLoaded) {
      setIsLoadingMore(true);
      try {
        const oldestMsgId = sortedChat[0].id;
        const { data } = await api.get(`/notebook/${notebookId}/chat?lastMessageId=${oldestMsgId}`);
        if (data && data.length > 0) {
          previousScrollHeightRef.current = target.scrollHeight;
          onOlderMessagesLoaded(data);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error('Failed to load older messages:', error);
      } finally {
        // A small timeout ensures layout effect runs before we unset the flag
        setTimeout(() => setIsLoadingMore(false), 100);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !notebookId) return;

    const currentMessage = message;
    setMessage('');
    setIsSending(true);

    const userMsg: ChatHistoryResponse = {
      id: Date.now(),
      message: currentMessage,
      senderRole: Sender.User,
      sendDateTime: new Date().toISOString()
    };
    
    // Optimistically add user message immediately
    onMessageAdded(userMsg);

    try {
      const { data } = await api.post(`/notebook/${notebookId}/chat`, { message: currentMessage });

      const aiMsg: ChatHistoryResponse = {
        id: Date.now() + 1,
        message: data.response,
        senderRole: Sender.AI,
        sendDateTime: new Date().toISOString()
      };
      
      // Add AI response once received
      onMessageAdded(aiMsg);
    } catch (error: any) {
      console.error('Failed to send message:', error);
      const errorMsg = error.response?.data?.detail || error.response?.data?.message || error.response?.data || error.message || 'Unknown error';
      alert(`Failed to send message. Details: ${typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg)}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !notebookId) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("File size cannot exceed 10MB");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploading(true);
      await api.post(`/notebooks/${notebookId}/files`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      if (onRefresh) {
        onRefresh();
      }
    } catch (error: any) {
      console.error('Upload failed:', error);
      alert(error.response?.data || "Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <section className="w-full bg-surface-container-lowest flex flex-col relative h-full">
      <div 
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-2 hide-scrollbar pb-40 lg:pb-32"
      >
        {isLoadingMore && (
          <div className="flex justify-center py-4">
            <span className="material-symbols-outlined animate-spin text-primary opacity-60">progress_activity</span>
          </div>
        )}
        
        {sortedChat.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-on-surface-variant opacity-60">
            <span className="material-symbols-outlined text-4xl mb-4">forum</span>
            <p>No messages yet. Ask a question about your sources to start learning!</p>
          </div>
        ) : (
          sortedChat.map((chat) => (
            chat.senderRole === Sender.User ? (
              <div key={chat.id} className="flex gap-4 max-w-[90%] ml-auto flex-row-reverse">
                <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-on-surface-variant text-lg">person</span>
                </div>
                <div className="space-y-1 text-right">
                  <div className="bg-primary text-on-primary p-2 rounded-xl rounded-tr-none leading-relaxed text-sm shadow-md shadow-primary/10 selection:bg-white selection:text-primary overflow-hidden">
                    <div className="prose prose-sm prose-invert max-w-none text-right">
                      <ReactMarkdown>{chat.message}</ReactMarkdown>
                    </div>
                  </div>
                  <p className="text-[10px] text-on-surface-variant px-1">You • {getRelativeTime(chat.sendDateTime)}</p>
                </div>
              </div>
            ) : (
              <div key={chat.id} className="flex gap-4 max-w-[90%]">
                <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-on-primary-container text-lg">auto_awesome</span>
                </div>
                <div className="space-y-1 text-left">
                  <div className="bg-surface-container-low p-2 rounded-xl rounded-tl-none text-on-surface leading-relaxed text-sm selection:bg-primary selection:text-on-primary overflow-hidden">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{chat.message}</ReactMarkdown>
                    </div>
                  </div>
                  <p className="text-[10px] text-on-surface-variant px-1">AI Assistant • {getRelativeTime(chat.sendDateTime)}</p>
                </div>
              </div>
            )
          ))
        )}
        
        {isSending && (
          <div className="flex gap-4 max-w-[90%]">
            <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-primary-container text-lg animate-pulse">auto_awesome</span>
            </div>
            <div className="bg-surface-container-low p-2 rounded-xl rounded-tl-none text-on-surface flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </div>
        )}
        
        <div ref={endOfMessagesRef} />
      </div>

      {/* Floating Chat Input */}
      <div className="absolute bottom-24 lg:bottom-6 left-0 right-0 px-4 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white border border-outline-variant/20 shadow-xl shadow-on-surface/5 rounded-2xl p-2 flex items-center gap-2 group focus-within:ring-4 focus-within:ring-primary/5 transition-all">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept=".pdf,.doc,.docx,.txt,.csv"
          />
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              disabled={isUploading || isSending}
              title="Add attachment"
              className={`p-2 rounded-xl text-on-surface-variant transition-colors flex items-center justify-center disabled:opacity-50 ${isMenuOpen ? 'bg-surface-container' : 'hover:bg-surface-container'}`}
            >
              {isUploading ? (
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined">add</span>
              )}
            </button>
            
            {isMenuOpen && (
              <div className="absolute bottom-full left-0 mb-3 w-48 bg-surface-container-lowest rounded-2xl shadow-xl shadow-on-surface/5 border border-outline-variant/20 py-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <button 
                  onClick={() => {
                    fileInputRef.current?.click();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-on-surface hover:bg-surface-container transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px] text-primary">upload_file</span>
                  Add Source
                </button>
              </div>
            )}
          </div>
          <textarea 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSending}
            className="flex-1 bg-transparent outline-none border-none focus:ring-0 text-sm py-2 resize-none max-h-32 hide-scrollbar" 
            placeholder="Ask StudyLM anything about your sources..." 
            rows={1}
          ></textarea>
          <div className="flex items-center gap-1 pr-1">
            <button 
              onClick={handleSendMessage}
              disabled={isSending || !message.trim()}
              className="bg-primary text-on-primary p-2 rounded-xl hover:bg-primary-container transition-all shadow-sm flex items-center justify-center disabled:opacity-50"
            >
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
