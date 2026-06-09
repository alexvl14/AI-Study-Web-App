import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import api from '../../services/api';
import type { ChatHistoryResponse } from '../../types/notebook';
import { Sender } from '../../types/notebook';

interface ChatInterfaceProps {
  notebookId?: string;
  chatHistory: ChatHistoryResponse[];
  filesCount: number;
  onMessageAdded: (msg: ChatHistoryResponse) => void;
  onOlderMessagesLoaded?: (msgs: ChatHistoryResponse[]) => void;
  onRefresh?: () => void;
}

export default function ChatInterface({ notebookId, chatHistory, filesCount, onMessageAdded, onOlderMessagesLoaded, onRefresh }: ChatInterfaceProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const previousScrollHeightRef = useRef<number>(0);

  const sortedChat = [...chatHistory].sort((a, b) =>
    new Date(a.sendDateTime).getTime() - new Date(b.sendDateTime).getTime()
  );

  useEffect(() => {
    if (!isLoadingMore) {
      endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory.length, isSending]);

  useLayoutEffect(() => {
    if (isLoadingMore && chatContainerRef.current && previousScrollHeightRef.current > 0) {
      const newScrollHeight = chatContainerRef.current.scrollHeight;
      chatContainerRef.current.scrollTop = newScrollHeight - previousScrollHeightRef.current;
      previousScrollHeightRef.current = 0;
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
      sendDateTime: new Date().toISOString(),
    };
    onMessageAdded(userMsg);

    try {
      const { data } = await api.post(`/notebook/${notebookId}/chat`, { message: currentMessage });
      const aiMsg: ChatHistoryResponse = {
        id: Date.now() + 1,
        message: data.response,
        senderRole: Sender.AI,
        sendDateTime: new Date().toISOString(),
      };
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
      alert('File size cannot exceed 10MB');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploading(true);
      await api.post(`/notebooks/${notebookId}/files`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (onRefresh) onRefresh();
    } catch (error: any) {
      console.error('Upload failed:', error);
      alert(error.response?.data || 'Failed to upload file');
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

  const formatTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <section className="w-full flex flex-col h-full bg-background border-r border-outline-variant">
      {/* Header */}
      <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-white shrink-0">
        <div>
          <h3 className="font-serif font-semibold text-lg text-on-surface">Academic Assistant</h3>
          <p className="text-xs text-outline font-sans">
            Analyzing {filesCount} source{filesCount !== 1 ? 's' : ''}
          </p>
        </div>
        <span className="material-symbols-outlined text-outline cursor-pointer select-none">more_horiz</span>
      </div>

      {/* Messages */}
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-6 space-y-2 flex flex-col"
      >
        {isLoadingMore && (
          <div className="flex justify-center py-2 shrink-0">
            <span className="material-symbols-outlined animate-spin text-primary opacity-60">progress_activity</span>
          </div>
        )}

        {sortedChat.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 text-outline opacity-60 gap-3">
            <span className="material-symbols-outlined text-4xl">forum</span>
            <p className="text-sm font-sans text-center">No messages yet. Ask a question about your sources to start learning!</p>
          </div>
        ) : (
          sortedChat.map((chat) =>
            chat.senderRole === Sender.User ? (
              /* User bubble */
              <div key={chat.id} className="flex flex-col max-w-[85%] self-end items-end shrink-0">
                <div className="etched-border bg-primary p-4 text-white shadow-hard-sm relative">
                  <div className="prose prose-sm prose-invert max-w-none">
                    <ReactMarkdown>{chat.message}</ReactMarkdown>
                  </div>
                  <div className="absolute -right-1.5 top-4 w-3 h-3 bg-primary rotate-45" />
                </div>
                <span className="text-[10px] mt-1 uppercase font-bold text-outline-variant px-1 font-sans">
                  You • {formatTime(chat.sendDateTime)}
                </span>
              </div>
            ) : (
              /* AI bubble */
              <div key={chat.id} className="flex flex-col max-w-[85%] self-start shrink-0">
                <div className="etched-border bg-white p-4 relative">
                  <div className="prose prose-sm max-w-none text-on-surface">
                    <ReactMarkdown>{chat.message}</ReactMarkdown>
                  </div>
                  <div
                    className="absolute -left-1.5 top-4 w-3 h-3 bg-white rotate-45"
                    style={{ borderLeft: '1px solid #1b1c1c', borderBottom: '1px solid #1b1c1c' }}
                  />
                </div>
                <span className="text-[10px] mt-1 uppercase font-bold text-outline-variant px-1 font-sans">
                  StudyLM • {formatTime(chat.sendDateTime)}
                </span>
              </div>
            )
          )
        )}

        {isSending && (
          <div className="flex flex-col max-w-[85%] self-start shrink-0">
            <div className="etched-border bg-white p-4 relative">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }} />
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
              <div
                className="absolute -left-1.5 top-4 w-3 h-3 bg-white rotate-45"
                style={{ borderLeft: '1px solid #1b1c1c', borderBottom: '1px solid #1b1c1c' }}
              />
            </div>
            <span className="text-[10px] mt-1 uppercase font-bold text-outline-variant px-1 font-sans">StudyLM</span>
          </div>
        )}

        <div ref={endOfMessagesRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-outline-variant bg-white shrink-0">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          accept=".pdf,.doc,.docx,.txt,.csv"
        />
        <div className="flex gap-4 items-end">
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSending}
              className="w-full etched-border py-4 pl-4 pr-12 focus:ring-0 focus:border-primary font-sans text-sm placeholder:text-outline-variant bg-surface-container-lowest resize-none max-h-32 hide-scrollbar leading-6 block"
              placeholder="Ask your research documents..."
              rows={1}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant hover:text-primary transition-colors disabled:opacity-50"
              title="Attach file"
            >
              {isUploading ? (
                <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined text-xl">attach_file</span>
              )}
            </button>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={isSending || !message.trim()}
            className="bg-primary text-white w-14 h-14 etched-border shadow-hard btn-press flex items-center justify-center group disabled:opacity-50 shrink-0"
          >
            <span className="material-symbols-outlined transition-transform group-hover:-rotate-45 group-hover:-translate-y-0.5">
              send
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
