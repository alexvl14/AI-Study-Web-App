import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="w-full min-h-screen bg-background pt-16 overflow-x-hidden selection:bg-primary/20 selection:text-primary relative z-0">
      {/* Decorative Background Gradients */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] pointer-events-none -z-10 animate-[pulse_4s_ease-in-out_infinite]"></div>
      <div className="fixed bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-[120px] pointer-events-none -z-10 animate-[pulse_4s_ease-in-out_infinite]" style={{ animationDelay: '2s' }}></div>

      {/* Decorative Background Book SVG */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[800px] pointer-events-none -z-20 opacity-30 dark:opacity-40 overflow-hidden flex items-start pt-10 justify-center">
        <svg width="1000" height="600" viewBox="0 0 1000 600" className="text-primary animate-[pulse_6s_ease-in-out_infinite]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(0, 20)">
            {/* Book Base / Shadows */}
            <path d="M 500 500 Q 300 550 100 400 L 100 100 Q 300 250 500 200 Q 700 250 900 100 L 900 400 Q 700 550 500 500 Z" fill="currentColor" opacity="0.05"/>
            
            {/* Left Pages Stack */}
            <path d="M 500 500 Q 300 550 100 400 L 100 420 Q 300 570 500 520 Z" fill="currentColor" opacity="0.2"/>
            <path d="M 500 520 Q 300 570 100 420 L 100 440 Q 300 590 500 540 Z" fill="currentColor" opacity="0.3"/>
            
            {/* Right Pages Stack */}
            <path d="M 500 500 Q 700 550 900 400 L 900 420 Q 700 570 500 520 Z" fill="currentColor" opacity="0.2"/>
            <path d="M 500 520 Q 700 570 900 420 L 900 440 Q 700 590 500 540 Z" fill="currentColor" opacity="0.3"/>

            {/* Top Left Page */}
            <path d="M 500 500 Q 300 550 100 400 L 100 100 Q 300 250 500 200 Z" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="4" strokeLinejoin="round"/>
            
            {/* Top Right Page */}
            <path d="M 500 500 Q 700 550 900 400 L 900 100 Q 700 250 500 200 Z" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="4" strokeLinejoin="round"/>
            
            {/* Center Spine */}
            <path d="M 500 200 L 500 540" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
            
            {/* Text lines on Left Page */}
            <path d="M 450 280 Q 300 320 150 220" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.5"/>
            <path d="M 450 330 Q 300 370 150 270" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.5"/>
            <path d="M 450 380 Q 300 420 150 320" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.5"/>
            <path d="M 450 430 Q 300 470 200 380" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.5"/>

            {/* Animated Turning Pages */}
            <g className="origin-[500px_center]" style={{ transformStyle: 'preserve-3d', animation: 'flipSvgPage 9s linear infinite' }}>
               <path d="M 500 500 Q 700 550 900 400 L 900 100 Q 700 250 500 200 Z" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
               <path d="M 550 280 Q 700 320 850 220" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.5"/>
               <path d="M 550 330 Q 700 370 850 270" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.5"/>
               <path d="M 550 380 Q 700 420 850 320" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.5"/>
            </g>
            <g className="origin-[500px_center]" style={{ transformStyle: 'preserve-3d', animation: 'flipSvgPage 9s linear infinite', animationDelay: '-3s' }}>
               <path d="M 500 500 Q 700 550 900 400 L 900 100 Q 700 250 500 200 Z" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
               <path d="M 550 280 Q 700 320 850 220" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.5"/>
               <path d="M 550 330 Q 700 370 850 270" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.5"/>
            </g>
            <g className="origin-[500px_center]" style={{ transformStyle: 'preserve-3d', animation: 'flipSvgPage 9s linear infinite', animationDelay: '-6s' }}>
               <path d="M 500 500 Q 700 550 900 400 L 900 100 Q 700 250 500 200 Z" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
               <path d="M 550 280 Q 700 320 850 220" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.5"/>
               <path d="M 550 330 Q 700 370 850 270" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.5"/>
               <path d="M 550 380 Q 700 420 850 320" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.5"/>
               <path d="M 550 430 Q 700 470 800 380" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.5"/>
            </g>
          </g>
          
          {/* Magic Stars / AI Sparkles */}
          <path className="animate-[pulse_2s_ease-in-out_infinite]" d="M 300 50 L 310 80 L 340 90 L 310 100 L 300 130 L 290 100 L 260 90 L 290 80 Z" fill="currentColor"/>
          <path className="animate-[pulse_3s_ease-in-out_infinite]" d="M 700 80 L 705 100 L 725 105 L 705 110 L 700 130 L 695 110 L 675 105 L 695 100 Z" fill="currentColor"/>
          <path className="animate-[pulse_2.5s_ease-in-out_infinite]" d="M 500 20 L 505 40 L 525 45 L 505 50 L 500 70 L 495 50 L 475 45 L 495 40 Z" fill="currentColor"/>
        </svg>
      </div>

      {/* Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-6 pt-24 pb-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high/50 backdrop-blur-md border border-outline-variant/30 text-xs font-bold text-on-surface-variant mb-8 shadow-sm">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          StudyLM is now in public beta
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-on-surface mb-8 max-w-5xl leading-[1.1]">
          Supercharge your study with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-container to-secondary">AI-driven</span> roadmaps.
        </h1>
        
        <p className="text-lg md:text-xl text-on-surface-variant mb-12 max-w-2xl leading-relaxed">
          Upload your PDFs and let our intelligent engine generate personalized study plans, quizzes, and instant context. Never read a textbook the same way again.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto z-10">
          <Link 
            to="/register" 
            className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary/90 text-on-primary rounded-2xl font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(37,99,235,0.3)] active:scale-95 flex items-center justify-center gap-2"
          >
            Get Started for Free
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </Link>
          <a 
            href="#how-it-works" 
            className="w-full sm:w-auto px-8 py-4 bg-surface-container-highest/50 backdrop-blur-md hover:bg-surface-container-high text-on-surface rounded-2xl font-bold text-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border border-outline-variant/20"
          >
            See How It Works
          </a>
        </div>
        
        {/* Abstract UI Mockup Element */}
        <div className="mt-24 w-full max-w-5xl mx-auto rounded-3xl border border-outline-variant/20 bg-surface-container-lowest/80 backdrop-blur-3xl shadow-2xl overflow-hidden transform perspective-1000 rotate-x-12 hover:rotate-x-0 transition-transform duration-700 ease-out flex flex-col">
          <div className="h-12 bg-surface-container-low border-b border-outline-variant/10 flex items-center px-4 gap-2 shrink-0">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div className="flex h-[500px] w-full text-left">
            {/* Left Sidebar Mock (Sources) */}
            <div className="w-64 border-r border-outline-variant/10 p-6 flex flex-col gap-4 bg-surface">
               <div className="flex items-center gap-2 mb-2">
                 <span className="material-symbols-outlined text-[16px] text-on-surface-variant">folder</span>
                 <div className="h-3 w-20 bg-on-surface-variant/40 rounded-full"></div>
               </div>
               
               <div className="h-24 bg-surface-container-lowest rounded-xl border border-outline-variant/20 flex flex-col justify-center items-center gap-2 shadow-sm group hover:border-primary/30 transition-colors">
                 <span className="material-symbols-outlined text-red-500 text-[28px] group-hover:scale-110 transition-transform">picture_as_pdf</span>
                 <div className="h-2 w-24 bg-on-surface-variant/30 rounded-full"></div>
               </div>
               
               <div className="h-24 bg-surface-container-lowest rounded-xl border border-outline-variant/20 flex flex-col justify-center items-center gap-2 shadow-sm group hover:border-primary/30 transition-colors">
                 <span className="material-symbols-outlined text-blue-500 text-[28px] group-hover:scale-110 transition-transform">description</span>
                 <div className="h-2 w-20 bg-on-surface-variant/30 rounded-full"></div>
               </div>
            </div>
            
            {/* Main Area Mock */}
            <div className="flex-1 flex flex-col relative bg-surface-container-lowest">
              {/* Top bar */}
              <div className="h-16 border-b border-outline-variant/10 flex items-center px-8 justify-between">
                <div className="h-4 w-48 bg-on-surface/10 rounded-full"></div>
                <div className="h-8 w-24 bg-primary/10 rounded-lg"></div>
              </div>
              
              {/* Chat Area */}
              <div className="flex-1 p-8 flex flex-col gap-6 overflow-hidden">
                {/* AI Message */}
                <div className="flex gap-4 max-w-[85%]">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                    <span className="material-symbols-outlined text-[20px] text-primary">auto_awesome</span>
                  </div>
                  <div className="bg-surface p-5 rounded-2xl rounded-tl-sm border border-outline-variant/10 shadow-sm space-y-3 w-full">
                    <div className="h-3 w-full bg-on-surface-variant/40 rounded-full"></div>
                    <div className="h-3 w-[95%] bg-on-surface-variant/40 rounded-full"></div>
                    <div className="h-3 w-4/5 bg-on-surface-variant/40 rounded-full"></div>
                    <div className="flex gap-2 pt-2">
                      <div className="h-6 w-16 bg-primary/10 rounded-md"></div>
                      <div className="h-6 w-16 bg-primary/10 rounded-md"></div>
                    </div>
                  </div>
                </div>
                
                {/* User Message */}
                <div className="flex gap-4 max-w-[70%] self-end flex-row-reverse">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 border border-secondary/20">
                    <span className="material-symbols-outlined text-[20px] text-secondary">person</span>
                  </div>
                  <div className="bg-primary text-on-primary p-5 rounded-2xl rounded-tr-sm shadow-md space-y-3 w-full">
                    <div className="h-3 w-full bg-white/70 rounded-full"></div>
                    <div className="h-3 w-2/3 bg-white/70 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              {/* Input Area */}
              <div className="p-6 pt-2 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest to-transparent">
                <div className="h-14 w-full bg-surface border border-outline-variant/20 rounded-full shadow-sm flex items-center px-6 justify-between">
                  <div className="h-3 w-48 bg-on-surface-variant/30 rounded-full"></div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant">attach_file</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-md shadow-primary/20">
                      <span className="material-symbols-outlined text-[16px] text-white">arrow_upward</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Sidebar Mock (Roadmap) */}
            <div className="hidden lg:flex w-64 border-l border-outline-variant/10 p-5 bg-surface flex-col gap-6">
              <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                   <span className="material-symbols-outlined text-[18px] text-primary">auto_stories</span>
                 </div>
                 <div className="h-3 w-24 bg-on-surface/20 rounded-full"></div>
              </div>
              
              {/* Modules */}
              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <div className="w-4 h-4 rounded-full bg-green-500 ring-4 ring-green-500/20 shrink-0 mt-1"></div>
                  <div className="w-full bg-surface-container-lowest p-4 rounded-xl border border-green-500/30 shadow-sm">
                    <div className="h-2 w-16 bg-green-500/60 rounded-full mb-3"></div>
                    <div className="h-3 w-full bg-on-surface/40 rounded-full mb-2"></div>
                    <div className="h-3 w-2/3 bg-on-surface/40 rounded-full"></div>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-4 h-4 rounded-full bg-primary ring-4 ring-primary/20 shrink-0 mt-1"></div>
                  <div className="w-full bg-surface-container-lowest p-4 rounded-xl border border-primary/30 shadow-sm hover:border-primary/50 transition-colors">
                    <div className="h-2 w-16 bg-primary/60 rounded-full mb-3"></div>
                    <div className="h-3 w-[90%] bg-on-surface/60 rounded-full mb-2"></div>
                    <div className="h-3 w-3/4 bg-on-surface/60 rounded-full"></div>
                  </div>
                </div>
                <div className="flex gap-3 items-start opacity-60">
                  <div className="w-4 h-4 rounded-full border-2 border-outline-variant shrink-0 mt-1"></div>
                  <div className="w-full bg-surface-container-low p-4 rounded-xl">
                    <div className="h-2 w-16 bg-outline-variant rounded-full mb-3"></div>
                    <div className="h-3 w-4/5 bg-on-surface-variant/40 rounded-full mb-2"></div>
                    <div className="h-3 w-1/2 bg-on-surface-variant/40 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-6 py-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-on-surface mb-4">Everything you need to ace it.</h2>
          <p className="text-on-surface-variant text-lg">Designed specifically for modern students and lifelong learners.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          {/* Feature 1: Wide */}
          <div className="md:col-span-2 relative overflow-hidden rounded-3xl bg-surface-container-lowest border border-outline-variant/20 p-8 hover:shadow-2xl hover:border-primary/30 transition-all duration-300 group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <span className="material-symbols-outlined text-4xl text-primary mb-4 p-3 bg-primary/10 rounded-2xl inline-block">account_tree</span>
                <h3 className="text-2xl font-bold text-on-surface mb-2">Automated Study Plans</h3>
                <p className="text-on-surface-variant max-w-sm">Our AI scans your uploaded materials and breaks them down into logical, digestible learning modules sorted by difficulty.</p>
              </div>
            </div>
          </div>
          
          {/* Feature 2: Small */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary to-primary-container text-on-primary p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-full h-full bg-white/5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjIpIi8+PC9zdmc+')] mix-blend-overlay"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <span className="material-symbols-outlined text-4xl mb-4 p-3 bg-white/20 rounded-2xl inline-block backdrop-blur-sm">quiz</span>
                <h3 className="text-2xl font-bold mb-2">Smart Quizzes</h3>
                <p className="opacity-90">Test your knowledge at the end of each module with automatically generated quizzes.</p>
              </div>
            </div>
          </div>

          {/* Feature 3: Small */}
          <div className="relative overflow-hidden rounded-3xl bg-surface-container-lowest border border-outline-variant/20 p-8 hover:shadow-2xl hover:border-primary/30 transition-all duration-300 group hover:-translate-y-1">
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <span className="material-symbols-outlined text-4xl text-secondary mb-4 p-3 bg-secondary/10 rounded-2xl inline-block">smart_toy</span>
                <h3 className="text-2xl font-bold text-on-surface mb-2">RAG Chatbot</h3>
                <p className="text-on-surface-variant">Chat directly with your documents. Ask questions and get cited answers instantly.</p>
              </div>
            </div>
          </div>

          {/* Feature 4: Wide */}
          <div className="md:col-span-2 relative overflow-hidden rounded-3xl bg-surface-container-lowest border border-outline-variant/20 p-8 hover:shadow-2xl hover:border-primary/30 transition-all duration-300 group">
            <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-surface-container-high/20 to-transparent"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <span className="material-symbols-outlined text-4xl text-primary mb-4 p-3 bg-primary/10 rounded-2xl inline-block">analytics</span>
                <h3 className="text-2xl font-bold text-on-surface mb-2">Progress Tracking</h3>
                <p className="text-on-surface-variant max-w-sm">Watch your knowledge grow. We track the exact time spent per module and your overall completion rate.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="relative z-10 w-full max-w-7xl mx-auto px-6 py-32 border-t border-outline-variant/10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-on-surface mb-4">How it works</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-12 left-24 right-24 h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20"></div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-surface-container-lowest border-[8px] border-background shadow-xl flex items-center justify-center text-3xl font-black text-primary mb-6 ring-1 ring-outline-variant/20">1</div>
            <h3 className="text-xl font-bold text-on-surface mb-2">Upload Files</h3>
            <p className="text-on-surface-variant">Drop in your PDFs, text files, or lecture notes. We securely process everything.</p>
          </div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-surface-container-lowest border-[8px] border-background shadow-xl flex items-center justify-center text-3xl font-black text-primary mb-6 ring-1 ring-outline-variant/20">2</div>
            <h3 className="text-xl font-bold text-on-surface mb-2">Generate Roadmap</h3>
            <p className="text-on-surface-variant">Our AI reads your documents and creates a step-by-step syllabus tailored to your materials.</p>
          </div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-primary border-[8px] border-background shadow-xl shadow-primary/20 flex items-center justify-center text-3xl font-black text-on-primary mb-6 ring-1 ring-primary/20 hover:scale-110 transition-transform">3</div>
            <h3 className="text-xl font-bold text-on-surface mb-2">Learn & Quiz</h3>
            <p className="text-on-surface-variant">Read the AI-summarized modules, chat with the text, and test your knowledge.</p>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="relative z-10 w-full bg-surface-container-lowest border-t border-outline-variant/10 py-16 px-6 text-center">
        <h2 className="text-2xl font-bold text-on-surface mb-6">Ready to learn faster?</h2>
        <Link 
          to="/register" 
          className="inline-flex px-8 py-4 bg-primary hover:bg-primary/90 text-on-primary rounded-xl font-bold text-lg transition-all hover:-translate-y-1 hover:shadow-lg"
        >
          Create your free account
        </Link>
        <p className="text-sm text-on-surface-variant mt-8">© {new Date().getFullYear()} StudyLM. All rights reserved.</p>
      </footer>
    </div>
  );
}
