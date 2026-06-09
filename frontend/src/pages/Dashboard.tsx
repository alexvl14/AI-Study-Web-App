import { useState, useEffect } from 'react';
import NotebookGrid from '../components/dashboard/NotebookGrid';
import SideNavBar from '../components/layout/SideNavBar';
import api from '../services/api';
import type { Notebook } from '../types/notebook';

export default function Dashboard() {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createKey, setCreateKey] = useState(0);

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

  return (
    <div className="flex pt-[72px] min-h-screen">
      <SideNavBar onNewNotebook={() => setCreateKey(k => k + 1)} />

      <main className="flex-1 px-5 md:px-margin-desktop py-12">
        <div className="max-w-6xl mx-auto">
          <header className="mb-12">
            <p className="font-sans text-label-md text-primary uppercase tracking-widest mb-2">
              Active Research
            </p>
            <h2 className="font-serif text-headline-lg text-on-surface mb-4">
              Your Notebooks
            </h2>
            <p className="font-sans text-body-lg text-on-surface-variant max-w-2xl">
              Manage your academic inquiries, organize primary sources, and generate synthesized insights with StudyLM's heritage-inspired workbench.
            </p>
          </header>

          <NotebookGrid
            notebooks={notebooks}
            isLoading={isLoading}
            onRefresh={fetchNotebooks}
            triggerCreate={createKey}
          />
        </div>
      </main>
    </div>
  );
}
