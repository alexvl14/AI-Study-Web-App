import { Link } from 'react-router-dom';

const NOTEBOOKS = [
  { id: 1, title: 'Advanced Quantum Mechanics', sources: 14, tag: 'Physics', color: 'bg-primary', colorText: 'text-primary' },
  { id: 2, title: 'Economic History of Europe', sources: 8, tag: 'Economics', color: 'bg-tertiary', colorText: 'text-tertiary' },
  { id: 3, title: 'Cognitive Neuroscience', sources: 21, tag: 'Medicine', color: 'bg-on-secondary-container', colorText: 'text-secondary' },
  { id: 4, title: 'Sustainable Urbanism', sources: 5, tag: 'Design', color: 'bg-outline', colorText: 'text-primary' },
];

export default function NotebookGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <button className="group relative h-64 border-2 border-dashed border-outline-variant hover:border-primary/50 hover:bg-surface-container-low transition-all duration-300 rounded-xl flex flex-col items-center justify-center gap-4 bg-transparent outline-none ring-primary focus:ring-4">
        <div className="w-14 h-14 rounded-full bg-surface-container-highest group-hover:bg-primary group-hover:text-white transition-all flex items-center justify-center">
          <span className="material-symbols-outlined text-3xl">add</span>
        </div>
        <span className="font-bold text-sm text-on-surface-variant group-hover:text-primary tracking-tight">Create New Notebook</span>
      </button>

      {NOTEBOOKS.map((nb) => (
        <Link to={`/workspace`} key={nb.id} className="group h-64 bg-surface-container-lowest rounded-xl shadow-[0_12px_40px_rgba(25,28,30,0.06)] hover:shadow-[0_20px_50px_rgba(25,28,30,0.1)] transition-all duration-300 flex flex-col overflow-hidden outline-none ring-primary focus:ring-4">
          <div className={`h-2 ${nb.color}`}></div>
          <div className="p-6 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <span className={`material-symbols-outlined ${nb.colorText}`}>menu_book</span>
              <span className="material-symbols-outlined text-on-surface-variant/40 hover:text-on-surface cursor-pointer">more_vert</span>
            </div>
            <h3 className={`text-lg font-bold text-on-surface tracking-tight mb-2 group-hover:${nb.colorText} transition-colors`}>{nb.title}</h3>
            <div className="mt-auto space-y-3">
              <div className="flex items-center gap-2">
                <span className="bg-secondary-container/30 text-on-secondary-container text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">{nb.sources} Sources</span>
                <span className="bg-surface-container-high text-on-surface-variant text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">{nb.tag}</span>
              </div>
              <div className="flex items-center gap-1.5 text-on-surface-variant text-[11px]">
                <span className="material-symbols-outlined text-sm">schedule</span>
                <span>Modified recently</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
