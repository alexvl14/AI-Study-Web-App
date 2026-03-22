export default function SourcesSidebar() {
  return (
    <aside className="w-full bg-surface-container-low flex flex-col h-full py-8 pb-32 lg:pb-8 overflow-y-auto hide-scrollbar">
      <div className="px-6 mb-8 mt-2">
        <div className="flex items-center justify-between mb-2">
          <span className="font-manrope uppercase tracking-widest text-[10px] font-bold text-blue-700 dark:text-blue-400">Sources</span>
          <span className="material-symbols-outlined text-sm text-on-surface-variant cursor-pointer">info</span>
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6">Knowledge Base</h2>
        <button className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary rounded-xl py-3 px-4 font-semibold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
          <span className="material-symbols-outlined text-xl">upload</span>
          Add New Source
        </button>
      </div>
      <nav className="flex flex-col gap-1 mb-8">
        <div className="px-6 mb-2">
          <p className="font-manrope uppercase tracking-widest text-[10px] font-bold text-on-surface-variant opacity-60">Active Documents</p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 rounded-r-full py-3 px-6 border-l-4 border-blue-700 dark:border-blue-400 shadow-sm cursor-pointer">
          <span className="material-symbols-outlined">book_5</span>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold truncate">Macroeconomics_Ch4.pdf</p>
            <p className="text-[10px] opacity-70">Indexed 2m ago</p>
          </div>
          <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        </div>
        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 py-3 px-6 hover:bg-slate-100 dark:hover:bg-slate-900/50 transition-all cursor-pointer">
          <span className="material-symbols-outlined">history</span>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">Global_Trade_Trends.csv</p>
            <p className="text-[10px] opacity-70">Indexed 1h ago</p>
          </div>
          <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        </div>
        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 py-3 px-6 hover:bg-slate-100 dark:hover:bg-slate-900/50 transition-all cursor-pointer">
          <span className="material-symbols-outlined">folder_special</span>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">Research_Notes_Final.docx</p>
            <p className="text-[10px] opacity-70">Indexed 3h ago</p>
          </div>
          <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        </div>
      </nav>
      <div className="mt-auto px-6 pt-8 border-t border-outline-variant/10">
        <div className="flex items-center justify-around text-slate-500">
          <button className="flex flex-col items-center gap-1 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">help</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">Help</span>
          </button>
          <button className="flex flex-col items-center gap-1 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">chat_bubble</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">Feedback</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
