import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import NotebookGrid from '../components/dashboard/NotebookGrid';
import api from '../services/api';
import type { Notebook } from '../types/notebook';

export default function Dashboard() {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotebooks = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/notebooks');
      setNotebooks(response.data);
    } catch (error) {
      console.error('Failed to fetch notebooks', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotebooks();
  }, []);

  const lastOpenedNotebook = useMemo(() => {
    if (notebooks.length === 0) return null;
    return [...notebooks].sort((a, b) => 
      new Date(b.lastOpenedDateTime).getTime() - new Date(a.lastOpenedDateTime).getTime()
    )[0];
  }, [notebooks]);

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
    <main className="pt-24 px-8 pb-12 flex-1 relative z-10 w-full overflow-y-auto max-w-7xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2 font-headline">My Notebooks</h1>
        <p className="text-on-surface-variant font-body">Synthesize your research and manage your learning journey.</p>
      </header>
        
      <NotebookGrid notebooks={notebooks} isLoading={isLoading} onRefresh={fetchNotebooks} />
      
      <section className="mt-12">
        <div className="w-full bg-primary/5 rounded-3xl p-8 border border-primary/10 flex flex-col justify-center relative overflow-hidden">
          {lastOpenedNotebook ? (
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-primary mb-2">Resume where you left off</h2>
              <p className="text-on-surface-variant body-lg mb-6 max-w-md">
                Continue your research on <span className="font-bold text-on-surface">"{lastOpenedNotebook.title}"</span>. 
                You last opened this {getRelativeTime(lastOpenedNotebook.lastOpenedDateTime)}.
              </p>
              <Link 
                to={`/workspace/${lastOpenedNotebook.id}`}
                className="bg-primary text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-primary-container transition-colors shadow-lg shadow-primary/20 inline-flex items-center gap-2"
              >
                Open Notebook <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          ) : (
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-primary mb-2">Start your journey</h2>
              <p className="text-on-surface-variant body-lg mb-6 max-w-md">Create your first notebook to start organizing your research and learning materials with AI.</p>
            </div>
          )}
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-20">
            <span className="material-symbols-outlined text-[120px] text-primary">auto_awesome</span>
          </div>
        </div>
      </section>

    </main>
  );
}
