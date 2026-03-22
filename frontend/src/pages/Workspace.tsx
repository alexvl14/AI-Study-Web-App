import { useState } from 'react';
import SourcesSidebar from '../components/workspace/SourcesSidebar';
import ChatInterface from '../components/workspace/ChatInterface';
import StudyPlanSidebar from '../components/workspace/StudyPlanSidebar';
import TopicDrawer from '../components/workspace/TopicDrawer';

export default function Workspace() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'sources' | 'chat' | 'roadmap'>('chat');

  return (
    <main className="flex w-full relative z-10 pt-16 overflow-hidden h-screen bg-surface-container-lowest">
      {/* 3-column Layout for Desktop / Tab-based for Mobile */}
      <div className={`${activeTab === 'sources' ? 'flex' : 'hidden'} lg:flex w-full lg:w-[25%]`}>
        <SourcesSidebar />
      </div>

      <div className={`${activeTab === 'chat' ? 'flex' : 'hidden'} lg:flex w-full lg:w-[45%] border-x border-outline-variant/20`}>
        <ChatInterface />
      </div>

      <div className={`${activeTab === 'roadmap' ? 'flex' : 'hidden'} lg:flex w-full lg:w-[30%]`}>
        <StudyPlanSidebar onOpenTopic={() => setIsDrawerOpen(true)} />
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

      {isDrawerOpen && <TopicDrawer onClose={() => setIsDrawerOpen(false)} />}
    </main>
  );
}
