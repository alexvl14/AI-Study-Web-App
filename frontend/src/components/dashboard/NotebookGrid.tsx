import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import type { Notebook } from '../../types/notebook';

interface NotebookGridProps {
  notebooks?: Notebook[];
  isLoading?: boolean;
  onRefresh?: () => void;
  triggerCreate?: number;
}

export default function NotebookGrid({ notebooks: initialNotebooks, isLoading: initialLoading, onRefresh, triggerCreate }: NotebookGridProps) {
  const [notebooks, setNotebooks] = useState<Notebook[]>(initialNotebooks || []);
  const [isLoading, setIsLoading] = useState(initialLoading !== undefined ? initialLoading : true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [editingNotebook, setEditingNotebook] = useState<Notebook | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const handleClickOutside = () => setMenuOpenId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    if (initialNotebooks) setNotebooks(initialNotebooks);
  }, [initialNotebooks]);

  useEffect(() => {
    if (initialLoading !== undefined) setIsLoading(initialLoading);
  }, [initialLoading]);

  useEffect(() => {
    if (triggerCreate && triggerCreate > 0) setIsModalOpen(true);
  }, [triggerCreate]);

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
    if (!initialNotebooks) fetchNotebooks();
  }, []);

  const handleCreateNotebook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    try {
      setIsCreating(true);
      await api.post('/notebooks', { title: newTitle, description: newDescription });
      setIsModalOpen(false);
      setNewTitle('');
      setNewDescription('');
      onRefresh ? onRefresh() : await fetchNotebooks();
    } catch (error) {
      console.error('Failed to create notebook', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteNotebook = async (e: React.MouseEvent, notebookId: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this notebook? All sources and study plans will be permanently removed.')) return;
    try {
      await api.delete(`/notebooks/${notebookId}`);
      onRefresh ? onRefresh() : await fetchNotebooks();
    } catch (error) {
      console.error('Failed to delete notebook', error);
      alert('Failed to delete notebook');
    }
  };

  const handleUpdateNotebook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNotebook || !editTitle) return;
    try {
      setIsUpdating(true);
      await api.patch(`/notebooks/${editingNotebook.id}`, { title: editTitle, description: editDescription });
      setEditingNotebook(null);
      onRefresh ? onRefresh() : await fetchNotebooks();
    } catch (error) {
      console.error('Failed to update notebook', error);
      alert('Failed to update notebook');
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">

        {/* Create New Notebook card */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="group flex flex-col items-center justify-center p-8 border-2 border-dashed border-outline rounded bg-surface-container-low hover:bg-surface-container-high transition-all min-h-[320px]"
        >
          <div className="w-16 h-16 rounded-full etched-border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-4xl text-on-surface">add</span>
          </div>
          <span className="font-serif text-headline-md text-on-surface">Create New Notebook</span>
          <p className="font-sans text-body-md text-on-surface-variant mt-2 text-center">Start a fresh research project</p>
        </button>

        {/* Skeleton loaders */}
        {isLoading && Array.from({ length: 3 }).map((_, i) => (
          <div key={`skeleton-${i}`} className="min-h-[320px] bg-surface-container-lowest rounded etched-border animate-pulse flex flex-col p-6">
            <div className="h-5 w-1/2 bg-surface-container-highest rounded mb-3"></div>
            <div className="h-4 w-full bg-surface-container-highest rounded mb-2"></div>
            <div className="h-4 w-3/4 bg-surface-container-highest rounded mb-2"></div>
            <div className="mt-auto h-8 w-24 bg-surface-container-highest rounded"></div>
          </div>
        ))}

        {/* Notebook cards */}
        {!isLoading && notebooks.map((nb) => (
          <Link
            to={`/workspace/${nb.id}`}
            key={nb.id}
            className="group bg-white etched-border shadow-hard flex flex-col justify-between min-h-[320px] hover:-translate-y-1 transition-transform rounded"
          >
            <div className="p-6 flex flex-col h-full">
              {/* Card header */}
              <div className="flex justify-between items-start mb-6">
                <span className="material-symbols-outlined text-outline-variant">menu_book</span>
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setMenuOpenId(menuOpenId === nb.id ? null : nb.id);
                    }}
                    className="w-8 h-8 flex items-center justify-center text-outline-variant hover:text-on-surface transition-colors"
                  >
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>

                  {menuOpenId === nb.id && (
                    <div className="absolute right-0 mt-1 w-44 bg-surface-container-lowest etched-border shadow-hard z-50 py-1">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setEditTitle(nb.title);
                          setEditDescription(nb.description);
                          setEditingNotebook(nb);
                          setMenuOpenId(null);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 font-sans text-label-md text-on-surface hover:bg-surface-container transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                        Edit Notebook
                      </button>
                      <div className="h-px bg-outline-variant mx-2"></div>
                      <button
                        onClick={(e) => handleDeleteNotebook(e, nb.id)}
                        className="w-full flex items-center gap-2 px-4 py-2.5 font-sans text-label-md text-error hover:bg-error-container transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                        Delete Notebook
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Title + description */}
              <h3 className="font-serif text-headline-md text-on-surface mb-3 line-clamp-2">{nb.title}</h3>
              <p className="font-sans text-body-md text-on-surface-variant line-clamp-3">{nb.description}</p>

              {/* Footer */}
              <div className="mt-auto pt-6 border-t border-outline-variant flex items-center justify-between">
                <div className="flex items-center gap-2 font-sans text-label-md text-on-surface opacity-60">
                  <span className="material-symbols-outlined text-sm">event</span>
                  {formatDate(nb.lastOpenedDateTime)}
                </div>
                <div className="bg-primary-container text-on-primary-container px-4 py-2 font-sans font-bold text-sm etched-border shadow-hard-sm flex items-center gap-2">
                  Open <span className="text-base">→</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Edit Modal */}
      {editingNotebook && (
        <div className="fixed inset-0 bg-on-surface/60 z-[100] flex justify-center items-center p-4">
          <div className="bg-surface-container-lowest etched-border shadow-hard-lg max-w-md w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-headline-md text-on-surface">Edit Notebook</h2>
              <button
                onClick={() => setEditingNotebook(null)}
                className="p-2 text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleUpdateNotebook} className="space-y-5">
              <div>
                <label className="block font-sans text-label-md text-on-surface mb-2">Title</label>
                <input
                  autoFocus
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-surface-container-low etched-border px-4 py-3 font-sans text-body-md text-on-surface outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="e.g., Quantum Physics 101"
                  required
                />
              </div>
              <div>
                <label className="block font-sans text-label-md text-on-surface mb-2">
                  Description <span className="text-on-surface-variant font-normal">(Optional)</span>
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full bg-surface-container-low etched-border px-4 py-3 font-sans text-body-md text-on-surface outline-none focus:ring-2 focus:ring-primary transition-all resize-none h-24"
                  placeholder="What is this notebook about?"
                />
              </div>
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingNotebook(null)}
                  className="flex-1 py-3 font-sans font-bold text-label-md text-on-surface-variant etched-border hover:bg-surface-container transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating || !editTitle}
                  className="flex-1 bg-primary-container text-on-primary-container font-sans font-bold text-label-md py-3 etched-border shadow-hard btn-press transition-all disabled:opacity-50 flex justify-center items-center"
                >
                  {isUpdating
                    ? <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                    : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-on-surface/60 z-[100] flex justify-center items-center p-4">
          <div className="bg-surface-container-lowest etched-border shadow-hard-lg max-w-md w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-headline-md text-on-surface">New Notebook</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateNotebook} className="space-y-5">
              <div>
                <label className="block font-sans text-label-md text-on-surface mb-2">Title</label>
                <input
                  autoFocus
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-surface-container-low etched-border px-4 py-3 font-sans text-body-md text-on-surface outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="e.g., Quantum Physics 101"
                  required
                />
              </div>
              <div>
                <label className="block font-sans text-label-md text-on-surface mb-2">
                  Description <span className="text-on-surface-variant font-normal">(Optional)</span>
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-surface-container-low etched-border px-4 py-3 font-sans text-body-md text-on-surface outline-none focus:ring-2 focus:ring-primary transition-all resize-none h-24"
                  placeholder="What is this notebook about?"
                />
              </div>
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 font-sans font-bold text-label-md text-on-surface-variant etched-border hover:bg-surface-container transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !newTitle}
                  className="flex-1 bg-primary-container text-on-primary-container font-sans font-bold text-label-md py-3 etched-border shadow-hard btn-press transition-all disabled:opacity-50 flex justify-center items-center"
                >
                  {isCreating
                    ? <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                    : 'Create Notebook'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
