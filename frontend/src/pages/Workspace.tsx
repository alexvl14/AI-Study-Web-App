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
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
      </div>
    );
  }

  return (
    <main className="h-screen overflow-hidden pt-[72px] bg-background">
      <div className="h-full grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* COLUMN 1: Sources (3/12) */}
        <div className={`${activeTab === 'sources' ? 'flex' : 'hidden'} lg:flex flex-col lg:col-span-3 overflow-hidden`}>
          <SourcesSidebar
            notebookId={notebookId}
            files={notebookDetails?.files || []}
            onRefresh={fetchNotebookDetails}
            onFileAdded={(newFile) => {
              setNotebookDetails(prev => {
                if (!prev) return prev;
                return { ...prev, files: [...prev.files, newFile] };
              });
            }}
          />
        </div>

        {/* COLUMN 2: Chat (5/12) */}
        <div className={`${activeTab === 'chat' ? 'flex' : 'hidden'} lg:flex flex-col lg:col-span-5 overflow-hidden`}>
          <ChatInterface
            notebookId={notebookId}
            chatHistory={notebookDetails?.recentChat || []}
            filesCount={notebookDetails?.files?.length || 0}
            onRefresh={fetchNotebookDetails}
            onMessageAdded={(newMsg) => {
              setNotebookDetails(prev => {
                if (!prev) return prev;
                return { ...prev, recentChat: [...prev.recentChat, newMsg] };
              });
            }}
            onOlderMessagesLoaded={(oldMsgs) => {
              setNotebookDetails(prev => {
                if (!prev) return prev;
                const existingIds = new Set(prev.recentChat.map(m => m.id));
                const uniqueOldMsgs = oldMsgs.filter(m => !existingIds.has(m.id));
                return { ...prev, recentChat: [...uniqueOldMsgs, ...prev.recentChat] };
              });
            }}
          />
        </div>

        {/* COLUMN 3: Study Plan (4/12) */}
        <div className={`${activeTab === 'roadmap' ? 'flex' : 'hidden'} lg:flex flex-col lg:col-span-4 overflow-hidden`}>
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
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-outline flex justify-around items-center py-3 z-50">
        <button
          onClick={() => setActiveTab('sources')}
          className={`flex flex-col items-center gap-1 flex-1 py-1 transition-colors ${activeTab === 'sources' ? 'text-primary' : 'text-outline hover:text-on-surface'}`}
        >
          <span className="material-symbols-outlined">menu_book</span>
          <span className="text-[10px] font-bold uppercase">Sources</span>
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center gap-1 flex-1 py-1 transition-colors ${activeTab === 'chat' ? 'text-primary' : 'text-outline hover:text-on-surface'}`}
        >
          <span className="material-symbols-outlined">chat</span>
          <span className="text-[10px] font-bold uppercase">Chat</span>
        </button>
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`flex flex-col items-center gap-1 flex-1 py-1 transition-colors ${activeTab === 'roadmap' ? 'text-primary' : 'text-outline hover:text-on-surface'}`}
        >
          <span className="material-symbols-outlined">map</span>
          <span className="text-[10px] font-bold uppercase">Plan</span>
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
