import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import type { Notebook } from '../../types/notebook';

// Helper to assign a random color tag to notebooks since it's not in the backend DTO yet
const COLORS = [
  { bg: 'bg-primary', text: 'text-primary' },
  { bg: 'bg-tertiary', text: 'text-tertiary' },
  { bg: 'bg-on-secondary-container', text: 'text-secondary' },
  { bg: 'bg-outline', text: 'text-primary' }
];

interface NotebookGridProps {
  notebooks?: Notebook[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

export default function NotebookGrid({ notebooks: initialNotebooks, isLoading: initialLoading, onRefresh }: NotebookGridProps) {
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
  const navigate = useNavigate();

  // Close menu when clicking anywhere else
  useEffect(() => {
    const handleClickOutside = () => setMenuOpenId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    if (initialNotebooks) {
      setNotebooks(initialNotebooks);
    }
  }, [initialNotebooks]);

  useEffect(() => {
    if (initialLoading !== undefined) {
      setIsLoading(initialLoading);
    }
  }, [initialLoading]);

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
    if (!initialNotebooks) {
      fetchNotebooks();
    }
  }, [initialNotebooks]);

  const handleCreateNotebook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    
    try {
      setIsCreating(true);
      await api.post('/notebooks', { title: newTitle, description: newDescription });
      setIsModalOpen(false);
      setNewTitle('');
      setNewDescription('');
      if (onRefresh) {
        onRefresh();
      } else {
        await fetchNotebooks();
      }
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
      if (onRefresh) {
        onRefresh();
      } else {
        await fetchNotebooks();
      }
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
      await api.patch(`/notebooks/${editingNotebook.id}`, { 
        title: editTitle, 
        description: editDescription 
      });
      setEditingNotebook(null);
      if (onRefresh) {
        onRefresh();
      } else {
        await fetchNotebooks();
      }
    } catch (error) {
      console.error('Failed to update notebook', error);
      alert('Failed to update notebook');
    } finally {
      setIsUpdating(false);
    }
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    return `${diffInDays} days ago`;
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="group relative h-64 border-2 border-dashed border-outline-variant hover:border-primary/50 hover:bg-surface-container-low transition-all duration-300 rounded-xl flex flex-col items-center justify-center gap-4 bg-transparent outline-none ring-primary focus:ring-4"
        >
          <div className="w-14 h-14 rounded-full bg-surface-container-highest group-hover:bg-primary group-hover:text-white transition-all flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">add</span>
          </div>
          <span className="font-bold text-sm text-on-surface-variant group-hover:text-primary tracking-tight">Create New Notebook</span>
        </button>

        {isLoading ? (
          // Skeleton loaders
          Array.from({ length: 3 }).map((_, i) => (
            <div key={`skeleton-${i}`} className="h-64 bg-surface-container-lowest rounded-xl shadow-sm animate-pulse flex flex-col">
              <div className="h-2 bg-surface-container-highest"></div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="w-8 h-8 bg-surface-container-highest rounded-full mb-4"></div>
                <div className="h-4 w-3/4 bg-surface-container-highest rounded mb-2"></div>
                <div className="h-3 w-1/2 bg-surface-container-highest rounded mt-auto"></div>
              </div>
            </div>
          ))
        ) : (
          notebooks.map((nb, index) => {
            const colorObj = COLORS[index % COLORS.length];
            return (
              <Link to={`/workspace/${nb.id}`} key={nb.id} className="group h-64 bg-surface-container-lowest rounded-xl shadow-[0_12px_40px_rgba(25,28,30,0.06)] hover:shadow-[0_20px_50px_rgba(25,28,30,0.1)] transition-all duration-300 flex flex-col overflow-hidden outline-none ring-primary focus:ring-4">
                <div className={`h-2 ${colorObj.bg}`}></div>
                <div className="p-6 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4 relative">
                    <span className={`material-symbols-outlined ${colorObj.text}`}>menu_book</span>
                    <div className="relative">
                      <button 
                        onClick={(e) => { 
                          e.preventDefault(); 
                          e.stopPropagation();
                          setMenuOpenId(menuOpenId === nb.id ? null : nb.id);
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors"
                      >
                        <span className="material-symbols-outlined text-on-surface-variant/40 hover:text-on-surface">more_vert</span>
                      </button>
                      
                      {menuOpenId === nb.id && (
                        <div className="absolute right-0 mt-1 w-40 bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-xl z-50 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setEditTitle(nb.title);
                              setEditDescription(nb.description);
                              setEditingNotebook(nb);
                              setMenuOpenId(null);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-on-surface hover:bg-surface-container transition-colors whitespace-nowrap"
                          >
                            <span className="material-symbols-outlined text-sm">edit</span>
                            Edit Notebook
                          </button>
                          
                          <div className="h-[1px] bg-outline-variant/10 mx-2"></div>
                          
                          <button 
                            onClick={(e) => handleDeleteNotebook(e, nb.id)}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-error hover:bg-error/10 transition-colors whitespace-nowrap"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                            Delete Notebook
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <h3 className={`text-lg font-bold text-on-surface tracking-tight mb-1 group-hover:${colorObj.text} transition-colors line-clamp-2`}>{nb.title}</h3>
                  <p className="text-xs text-on-surface-variant line-clamp-2 mb-2">{nb.description}</p>
                  
                  <div className="mt-auto space-y-3">
                    <div className="flex items-center gap-1.5 text-on-surface-variant text-[11px] font-medium bg-surface-container-low w-fit px-2 py-1 rounded-md">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      <span>Opened {getRelativeTime(nb.lastOpenedDateTime)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })
        )}
      </div>

      {/* Edit Modal */}
      {editingNotebook && (
        <div className="fixed inset-0 bg-on-surface/50 backdrop-blur-sm z-[100] flex justify-center items-center p-4 animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 border border-outline-variant/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold text-on-surface">Edit Notebook</h2>
              <button onClick={() => setEditingNotebook(null)} className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleUpdateNotebook} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-on-surface mb-2">Title</label>
                <input 
                  autoFocus
                  type="text" 
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-surface-container-low border border-transparent focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 text-on-surface outline-none transition-all font-medium text-sm"
                  placeholder="e.g., Quantum Physics 101"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-on-surface mb-2">Description <span className="text-on-surface-variant/50 font-normal">(Optional)</span></label>
                <textarea 
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full bg-surface-container-low border border-transparent focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 text-on-surface outline-none transition-all font-medium text-sm resize-none h-24"
                  placeholder="What is this notebook about?"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setEditingNotebook(null)}
                  className="flex-1 py-3 font-bold text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isUpdating || !editTitle}
                  className="flex-1 bg-primary text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-container transition-colors disabled:opacity-50 flex justify-center items-center"
                >
                  {isUpdating ? <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-on-surface/50 backdrop-blur-sm z-[100] flex justify-center items-center p-4 animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 border border-outline-variant/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold text-on-surface">New Notebook</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleCreateNotebook} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-on-surface mb-2">Title</label>
                <input 
                  autoFocus
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-surface-container-low border border-transparent focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 text-on-surface outline-none transition-all font-medium text-sm"
                  placeholder="e.g., Quantum Physics 101"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-on-surface mb-2">Description <span className="text-on-surface-variant/50 font-normal">(Optional)</span></label>
                <textarea 
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-surface-container-low border border-transparent focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 text-on-surface outline-none transition-all font-medium text-sm resize-none h-24"
                  placeholder="What is this notebook about?"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 font-bold text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isCreating || !newTitle}
                  className="flex-1 bg-primary text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-container transition-colors disabled:opacity-50 flex justify-center items-center"
                >
                  {isCreating ? <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span> : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
