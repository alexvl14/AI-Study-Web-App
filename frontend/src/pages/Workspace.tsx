import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import api from '../services/api';
import type { NotebookDetails } from '../types/notebook';
import SourcesSidebar from '../components/workspace/SourcesSidebar';
import ChatInterface from '../components/workspace/ChatInterface';
import StudyPlanSidebar from '../components/workspace/StudyPlanSidebar';
import StudyPlanDrawer from '../components/workspace/StudyPlanDrawer';

export default function Workspace() {
  const { notebookId } = useParams<{ notebookId: string }>();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'sources' | 'chat' | 'roadmap'>('chat');
  const [notebookDetails, setNotebookDetails] = useState<NotebookDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotebookDetails = async () => {
    if (!notebookId) return;
    try {
      setIsLoading(true);
      const response = await api.get(`/notebooks/${notebookId}`);
      setNotebookDetails(response.data);
    } catch (error) {
      console.error('Failed to fetch notebook details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotebookDetails();
  }, [notebookId]);

  if (!notebookId) {
    return <Navigate to="/dashboard" replace />;
  }

  if (isLoading && !notebookDetails) {
    return <div className="h-screen w-full flex items-center justify-center bg-surface-container-lowest"><span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span></div>;
  }

  return (
    <main className="flex w-full relative z-10 pt-16 overflow-hidden h-screen bg-surface-container-lowest">
      {/* 3-column Layout for Desktop / Tab-based for Mobile */}
      <div className={`${activeTab === 'sources' ? 'flex' : 'hidden'} lg:flex w-full lg:w-[25%]`}>
        <SourcesSidebar 
          notebookId={notebookId} 
          files={notebookDetails?.files || []} 
          onRefresh={fetchNotebookDetails} 
          onFileAdded={(newFile) => {
            setNotebookDetails(prev => {
              if (!prev) return prev;
              return {
                ...prev,
                files: [...prev.files, newFile]
              };
            });
          }}
        />
      </div>

      <div className={`${activeTab === 'chat' ? 'flex' : 'hidden'} lg:flex w-full lg:w-[45%] border-x border-outline-variant/20`}>
        <ChatInterface 
          notebookId={notebookId} 
          chatHistory={notebookDetails?.recentChat || []} 
          onRefresh={fetchNotebookDetails} 
          onMessageAdded={(newMsg) => {
            setNotebookDetails(prev => {
              if (!prev) return prev;
              return {
                ...prev,
                recentChat: [...prev.recentChat, newMsg]
              };
            });
          }}
          onOlderMessagesLoaded={(oldMsgs) => {
            setNotebookDetails(prev => {
              if (!prev) return prev;
              const existingIds = new Set(prev.recentChat.map(m => m.id));
              const uniqueOldMsgs = oldMsgs.filter(m => !existingIds.has(m.id));
              return {
                ...prev,
                recentChat: [...uniqueOldMsgs, ...prev.recentChat]
              };
            });
          }}
        />
      </div>

      <div className={`${activeTab === 'roadmap' ? 'flex' : 'hidden'} lg:flex w-full lg:w-[30%]`}>
        <StudyPlanSidebar 
          notebookId={notebookId} 
          studyPlans={notebookDetails?.studyPlans || []}
          onOpenTopic={(plan: any) => {
            if (plan && plan.id) {
              setSelectedPlanId(plan.id);
              setIsDrawerOpen(true);
            }
          }}
          onRefresh={fetchNotebookDetails}
          onPlanGenerated={(planId) => {
            setNotebookDetails(prev => {
              if (!prev) return prev;
              const updatedPlans = prev.studyPlans.map(plan => 
                plan.id === planId ? { ...plan, isGenerated: 1 } : plan
              );
              return { ...prev, studyPlans: updatedPlans };
            });
          }}
        />
      </div>
      
      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-outline-variant/20 flex justify-around items-center p-2 z-50">
        <button onClick={() => setActiveTab('sources')} className={`flex flex-col items-center gap-1 w-full py-2 rounded-xl transition-all ${activeTab === 'sources' ? 'text-primary bg-primary/10' : 'text-on-surface-variant hover:bg-surface-container-low'}`}>
          <span className="material-symbols-outlined text-xl">{activeTab === 'sources' ? 'menu_book' : 'book_4'}</span>
          <span className="text-[10px] font-bold">Sources</span>
        </button>
        <button onClick={() => setActiveTab('chat')} className={`flex flex-col items-center gap-1 w-full py-2 rounded-xl transition-all ${activeTab === 'chat' ? 'text-primary bg-primary/10' : 'text-on-surface-variant hover:bg-surface-container-low'}`}>
          <span className="material-symbols-outlined text-xl">{activeTab === 'chat' ? 'chat_bubble' : 'chat'}</span>
          <span className="text-[10px] font-bold">Chat</span>
        </button>
        <button onClick={() => setActiveTab('roadmap')} className={`flex flex-col items-center gap-1 w-full py-2 rounded-xl transition-all ${activeTab === 'roadmap' ? 'text-primary bg-primary/10' : 'text-on-surface-variant hover:bg-surface-container-low'}`}>
          <span className="material-symbols-outlined text-xl">{activeTab === 'roadmap' ? 'map' : 'map'}</span>
          <span className="text-[10px] font-bold">Roadmap</span>
        </button>
      </div>

      {isDrawerOpen && selectedPlanId !== null && notebookId && (
        <StudyPlanDrawer
          notebookId={notebookId}
          planId={selectedPlanId}
          onClose={() => {
            setIsDrawerOpen(false);
            setSelectedPlanId(null);
          }}
          onRefresh={fetchNotebookDetails}
        />
      )}
    </main>
  );
}
