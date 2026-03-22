interface StudyPlanSidebarProps {
  onOpenTopic: () => void;
}

export default function StudyPlanSidebar({ onOpenTopic }: StudyPlanSidebarProps) {
  return (
    <aside className="w-full bg-surface flex flex-col p-4 lg:p-8 overflow-y-auto hide-scrollbar pb-32 lg:pb-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-primary">auto_stories</span>
          <span className="font-manrope uppercase tracking-widest text-[10px] font-bold text-on-surface-variant opacity-60">Personalized Roadmap</span>
        </div>
        <h2 className="text-xl font-extrabold text-on-surface tracking-tight mb-2">AI Generated Study Plan</h2>
        <p className="text-xs text-on-surface-variant leading-relaxed">Based on your learning objectives and uploaded material for "Advanced Macroeconomics".</p>
      </div>

      {/* Timeline */}
      <div className="relative pl-4 space-y-12 mb-8">
        {/* Vertical Line */}
        <div className="absolute left-[23px] top-2 bottom-2 w-0.5 bg-outline-variant/30"></div>

        {/* Topic 1: Current */}
        <div className="relative flex gap-6 group cursor-pointer" onClick={onOpenTopic}>
          <div className="z-10 w-5 h-5 rounded-full bg-primary ring-4 ring-primary/20 flex items-center justify-center shrink-0 mt-1">
            <div className="w-2 h-2 rounded-full bg-white"></div>
          </div>
          <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-primary/20 flex-1 hover:border-primary/50 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">Current Module</span>
              <span className="text-[10px] font-medium text-primary">Active Now</span>
            </div>
            <h3 className="font-bold text-sm text-on-surface mb-1">Phillips Curve Dynamics</h3>
            <p className="text-xs text-on-surface-variant mb-4 line-clamp-2">Correlation between labor markets and price stability.</p>
            <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[65%]"></div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-[9px] font-bold text-on-surface-variant">65% Complete</span>
              <span className="text-[9px] font-bold text-on-surface-variant">45 mins left</span>
            </div>
          </div>
        </div>

        {/* Topic 2: Upcoming */}
        <div className="relative flex gap-6">
          <div className="z-10 w-5 h-5 rounded-full bg-surface-container-highest border-2 border-outline-variant flex items-center justify-center shrink-0 mt-1">
          </div>
          <div className="p-5 rounded-2xl hover:bg-surface-container-low transition-colors flex-1 cursor-default">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter opacity-60">Next Module</span>
            </div>
            <h3 className="font-bold text-sm text-on-surface/60 mb-1">Monetary Policy Transmission</h3>
            <p className="text-xs text-on-surface-variant/60 line-clamp-2">How interest rates affect aggregate demand.</p>
          </div>
        </div>

        {/* Topic 3: Upcoming */}
        <div className="relative flex gap-6">
          <div className="z-10 w-5 h-5 rounded-full bg-surface-container-highest border-2 border-outline-variant flex items-center justify-center shrink-0 mt-1">
          </div>
          <div className="p-5 rounded-2xl hover:bg-surface-container-low transition-colors flex-1 cursor-default">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter opacity-60">Final Review</span>
            </div>
            <h3 className="font-bold text-sm text-on-surface/60 mb-1">Fiscal Multipliers</h3>
            <p className="text-xs text-on-surface-variant/60 line-clamp-2">Measuring the impact of government spending.</p>
          </div>
        </div>
      </div>

      {/* Goal Summary Card */}
      <div className="mt-auto">
        <div className="bg-gradient-to-br from-primary to-primary-container p-6 rounded-3xl text-on-primary shadow-lg shadow-primary/10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Weekly Progress</p>
              <h4 className="text-xl font-bold">Excellent Momentum</h4>
            </div>
            <span className="material-symbols-outlined text-3xl opacity-50">trophy</span>
          </div>
          <p className="text-xs opacity-90 leading-relaxed mb-4">You've covered 12 topics this week. You're on track to complete the syllabus 2 days early.</p>
          <button className="w-full bg-white/20 backdrop-blur-md text-white py-2.5 rounded-xl text-xs font-bold hover:bg-white/30 transition-all">
            View Detailed Stats
          </button>
        </div>
      </div>
    </aside>
  );
}
