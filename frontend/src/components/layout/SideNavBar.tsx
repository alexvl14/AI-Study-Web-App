export default function SideNavBar() {
  return (
    <aside className="h-screen w-64 fixed left-0 top-0 pt-16 bg-slate-50 dark:bg-slate-950 flex flex-col py-8 hidden lg:flex border-r border-slate-200/50 dark:border-slate-800/50 z-40">
      <div className="px-6 mb-8 mt-4">
        <h2 className="font-manrope uppercase tracking-widest text-[10px] font-bold text-slate-400 mb-1">Knowledge Base</h2>
        <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">Sources</h1>
      </div>
      <nav className="flex-1">
        <div className="space-y-1">
          <a className="flex items-center gap-3 bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 rounded-r-full py-3 px-6 border-l-4 border-blue-700 dark:border-blue-400 transition-all active:scale-95 duration-150" href="#">
            <span className="material-symbols-outlined">book_5</span>
            <span className="font-manrope uppercase tracking-widest text-[10px] font-bold">Sources</span>
          </a>
          <a className="flex items-center gap-3 text-slate-500 dark:text-slate-400 py-3 px-6 hover:bg-slate-100 dark:hover:bg-slate-900/50 transition-all active:scale-95 duration-150" href="#">
            <span className="material-symbols-outlined">history</span>
            <span className="font-manrope uppercase tracking-widest text-[10px] font-bold">Recent</span>
          </a>
          <a className="flex items-center gap-3 text-slate-500 dark:text-slate-400 py-3 px-6 hover:bg-slate-100 dark:hover:bg-slate-900/50 transition-all active:scale-95 duration-150" href="#">
            <span className="material-symbols-outlined">folder_special</span>
            <span className="font-manrope uppercase tracking-widest text-[10px] font-bold">Collections</span>
          </a>
          <a className="flex items-center gap-3 text-slate-500 dark:text-slate-400 py-3 px-6 hover:bg-slate-100 dark:hover:bg-slate-900/50 transition-all active:scale-95 duration-150" href="#">
            <span className="material-symbols-outlined">grade</span>
            <span className="font-manrope uppercase tracking-widest text-[10px] font-bold">Starred</span>
          </a>
        </div>
      </nav>
      <div className="px-6 mt-auto space-y-4">
        <button className="w-full py-3 bg-gradient-to-br from-primary to-primary-container text-white rounded-full font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
          Add New Source
        </button>
        <div className="pt-4 border-t border-slate-200/50 space-y-2">
          <a className="flex items-center gap-3 text-slate-500 text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-colors" href="#">
            <span className="material-symbols-outlined text-sm">help</span> Help
          </a>
          <a className="flex items-center gap-3 text-slate-500 text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-colors" href="#">
            <span className="material-symbols-outlined text-sm">chat_bubble</span> Feedback
          </a>
        </div>
      </div>
    </aside>
  );
}
