import NotebookGrid from '../components/dashboard/NotebookGrid';
import SideNavBar from '../components/layout/SideNavBar';

export default function Dashboard() {
  return (
    <>
      <SideNavBar />
      <main className="lg:ml-64 pt-24 px-8 pb-12 flex-1 relative z-10 w-full overflow-y-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2 font-headline">My Notebooks</h1>
          <p className="text-on-surface-variant font-body">Synthesize your research and manage your learning journey.</p>
        </header>
        
        <NotebookGrid />
      
      <section className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-primary/5 rounded-xl p-8 border border-primary/10 flex flex-col justify-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-primary mb-2">Resume where you left off</h2>
            <p className="text-on-surface-variant body-lg mb-6 max-w-md">Continue your research on "Advanced Quantum Mechanics". Your last synthesis was 92% complete.</p>
            <button className="bg-primary text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-primary-container transition-colors shadow-lg shadow-primary/20 inline-flex items-center gap-2">
              Open Notebook <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-20">
            <span className="material-symbols-outlined text-[120px] text-primary">auto_awesome</span>
          </div>
        </div>
        
        <div className="bg-surface-container-high rounded-xl p-8 flex flex-col">
          <h2 className="text-lg font-bold text-on-surface mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-on-surface-variant">Active Notebooks</span>
              <span className="font-bold text-primary">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-on-surface-variant">Sources Analyzed</span>
              <span className="font-bold text-primary">148</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-on-surface-variant">Study Hours (Week)</span>
              <span className="font-bold text-primary">24.5</span>
            </div>
          </div>
          <div className="mt-auto pt-6">
            <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-primary w-3/4"></div>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mt-2 text-center">Weekly Goal: 75% Complete</p>
          </div>
        </div>
      </section>

      <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40">
        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>chat_spark</span>
      </button>
    </main>
    </>
  );
}
