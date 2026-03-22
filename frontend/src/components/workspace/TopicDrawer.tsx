interface TopicDrawerProps {
  onClose: () => void;
}

export default function TopicDrawer({ onClose }: TopicDrawerProps) {
  return (
    <div className="fixed inset-0 bg-on-surface/50 backdrop-blur-sm z-[100] flex justify-center items-center p-4 lg:p-8 animate-in fade-in duration-300">
      {/* Interactive Topic Drawer - Re-sized to take most of the screen */}
      <div className="w-full max-w-6xl bg-surface-container-lowest h-full rounded-2xl lg:rounded-3xl shadow-2xl flex flex-col relative overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Sticky Header */}
        <header className="px-4 lg:px-8 py-4 lg:py-6 bg-surface-container-lowest border-b border-outline-variant/10 flex items-start lg:items-center justify-between sticky top-0 z-10 flex-col lg:flex-row gap-4">
          <div className="flex items-center gap-4 w-full lg:w-auto overflow-hidden">
            <button onClick={onClose} className="p-3 bg-error/10 hover:bg-error/20 text-error rounded-full transition-colors flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined font-bold">close</span>
            </button>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl lg:text-3xl font-extrabold tracking-tight text-on-surface leading-none mb-1 truncate">Phillips Curve Dynamics</h2>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary truncate block">Advanced Macroeconomics</span>
            </div>
          </div>
          <div className="flex items-center gap-6 self-end lg:self-auto shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-[10px] lg:text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] lg:text-sm">volume_up</span> AI Reading
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-6 lg:px-16 py-8 space-y-12 hide-scrollbar">
          
          {/* Main Body Text */}
          <article className="max-w-4xl mx-auto">
            <p className="text-lg lg:text-xl leading-relaxed text-on-surface/90 font-medium mb-8">
              The Phillips curve is an economic concept developed by A. W. Phillips stating that <span className="bg-primary-fixed px-1 rounded">inflation and unemployment</span> have a stable and inverse relationship. The theory claims that with economic growth comes inflation, which in turn should lead to more jobs and less unemployment.
            </p>
            
            <div className="bg-surface-container-low p-6 lg:p-8 rounded-2xl mb-10 border-l-4 border-primary">
              <h4 className="text-sm font-extrabold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">psychology</span> Key Synthesis
              </h4>
              <p className="text-lg text-on-surface-variant leading-relaxed">
                However, the original concept has been somewhat empirically disproven due to the occurrence of <span className="italic font-bold text-on-surface">stagflation</span> in the 1970s, where there were high levels of both inflation and unemployment.
              </p>
            </div>
            
            <h3 className="text-2xl font-bold text-on-surface mb-4">Short-Run vs Long-Run</h3>
            <p className="text-lg text-on-surface-variant leading-relaxed mb-6">
              Modern economists distinguish between the short-run and long-run Phillips curve. The short-run curve generally shows an inverse relationship, but the long-run curve is often seen as a vertical line at the natural rate of unemployment, implying no trade-off exists in the long term.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-10">
              <div className="aspect-[4/3] bg-surface-container-high rounded-xl flex flex-col items-center justify-center p-6 text-center border border-outline-variant/20 hover:border-primary/50 transition-colors">
                <span className="material-symbols-outlined text-primary text-5xl mb-4">show_chart</span>
                <span className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">Short-Run Curve</span>
              </div>
              <div className="aspect-[4/3] bg-surface-container-high rounded-xl flex flex-col items-center justify-center p-6 text-center border border-outline-variant/20 hover:border-secondary/50 transition-colors">
                <span className="material-symbols-outlined text-secondary text-5xl mb-4">straight</span>
                <span className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">Long-Run Vertical Line</span>
              </div>
            </div>
          </article>

          {/* Quiz Me Section */}
          <section className="bg-surface-container-low rounded-3xl p-6 lg:p-12 mb-12 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-xl flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">quiz</span>
              </div>
              <div>
                <h3 className="text-2xl font-extrabold tracking-tight">Active Recall</h3>
                <p className="text-sm text-on-surface-variant mt-1">Test your understanding of the concepts above.</p>
              </div>
            </div>

            <div className="space-y-8">
              {/* Question 1 */}
              <div className="space-y-6">
                <p className="text-lg font-bold text-on-surface">1. What phenomenon in the 1970s challenged the original Phillips Curve theory?</p>
                <div className="space-y-4">
                  <label className="flex items-center gap-4 p-5 bg-surface-container-lowest rounded-xl border border-transparent hover:border-primary/30 transition-all cursor-pointer group shadow-sm">
                    <input type="radio" name="q1" className="w-5 h-5 text-primary focus:ring-primary" />
                    <span className="text-base font-medium text-on-surface-variant group-hover:text-on-surface">Hyperinflation</span>
                  </label>
                  <label className="flex items-center gap-4 p-5 bg-white rounded-xl border-2 border-primary transition-all cursor-pointer group shadow-md shadow-primary/5">
                    <input type="radio" name="q1" className="w-5 h-5 text-primary focus:ring-primary" defaultChecked />
                    <span className="text-base font-bold text-on-surface">Stagflation</span>
                    <span className="material-symbols-outlined text-primary ml-auto text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  </label>
                  <label className="flex items-center gap-4 p-5 bg-surface-container-lowest rounded-xl border border-transparent hover:border-primary/30 transition-all cursor-pointer group shadow-sm">
                    <input type="radio" name="q1" className="w-5 h-5 text-primary focus:ring-primary" />
                    <span className="text-base font-medium text-on-surface-variant group-hover:text-on-surface">Deflationary Spiral</span>
                  </label>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sticky Bottom Action Bar */}
        <footer className="p-4 lg:p-6 bg-surface-container-lowest border-t border-outline-variant/20 flex flex-col sm:flex-row justify-between items-center sm:gap-6 gap-4 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] pb-safe">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              <div className="h-8 w-8 rounded-full border-2 border-white bg-slate-200"></div>
              <div className="h-8 w-8 rounded-full border-2 border-white bg-slate-300"></div>
              <div className="h-8 w-8 rounded-full border-2 border-white bg-slate-400"></div>
            </div>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest sm:inline-block">12 students studying this</span>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-6 py-3.5 rounded-full text-sm font-bold text-on-surface hover:bg-surface-container-low transition-all">
              Save for later
            </button>
            <button className="flex-1 sm:flex-none px-8 py-3.5 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-full text-sm font-bold shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all">
              Check My Answers
            </button>
          </div>
        </footer>

      </div>
    </div>
  );
}
