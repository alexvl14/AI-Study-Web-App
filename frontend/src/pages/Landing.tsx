import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="w-full min-h-screen bg-background pt-[72px] overflow-x-hidden relative z-0">

      {/* Animated book SVG — original paths, raised to opacity-25 for visibility */}
      <div className="absolute top-[72px] left-1/2 -translate-x-1/2 w-full max-w-7xl h-[800px] pointer-events-none -z-10 opacity-25 overflow-hidden flex items-start pt-10 justify-center">
          <svg width="1000" height="600" viewBox="0 0 1000 600" className="text-primary animate-[pulse_6s_ease-in-out_infinite]" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(0, 20)">
              <path d="M 500 500 Q 300 550 100 400 L 100 100 Q 300 250 500 200 Q 700 250 900 100 L 900 400 Q 700 550 500 500 Z" fill="currentColor" opacity="0.05"/>
              <path d="M 500 500 Q 300 550 100 400 L 100 420 Q 300 570 500 520 Z" fill="currentColor" opacity="0.2"/>
              <path d="M 500 520 Q 300 570 100 420 L 100 440 Q 300 590 500 540 Z" fill="currentColor" opacity="0.3"/>
              <path d="M 500 500 Q 700 550 900 400 L 900 420 Q 700 570 500 520 Z" fill="currentColor" opacity="0.2"/>
              <path d="M 500 520 Q 700 570 900 420 L 900 440 Q 700 590 500 540 Z" fill="currentColor" opacity="0.3"/>
              <path d="M 500 500 Q 300 550 100 400 L 100 100 Q 300 250 500 200 Z" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="4" strokeLinejoin="round"/>
              <path d="M 500 500 Q 700 550 900 400 L 900 100 Q 700 250 500 200 Z" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="4" strokeLinejoin="round"/>
              <path d="M 500 200 L 500 540" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
              <path d="M 450 280 Q 300 320 150 220" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.5"/>
              <path d="M 450 330 Q 300 370 150 270" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.5"/>
              <path d="M 450 380 Q 300 420 150 320" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.5"/>
              <path d="M 450 430 Q 300 470 200 380" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.5"/>
              <g className="origin-[500px_center]" style={{ transformStyle: 'preserve-3d', animation: 'flipSvgPage 9s linear infinite' }}>
                <path d="M 500 500 Q 700 550 900 400 L 900 100 Q 700 250 500 200 Z" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M 550 280 Q 700 320 850 220" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.5"/>
                <path d="M 550 330 Q 700 370 850 270" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.5"/>
                <path d="M 550 380 Q 700 420 850 320" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.5"/>
              </g>
              <g className="origin-[500px_center]" style={{ transformStyle: 'preserve-3d', animation: 'flipSvgPage 9s linear infinite', animationDelay: '-3s' }}>
                <path d="M 500 500 Q 700 550 900 400 L 900 100 Q 700 250 500 200 Z" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M 550 280 Q 700 320 850 220" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.5"/>
                <path d="M 550 330 Q 700 370 850 270" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.5"/>
              </g>
              <g className="origin-[500px_center]" style={{ transformStyle: 'preserve-3d', animation: 'flipSvgPage 9s linear infinite', animationDelay: '-6s' }}>
                <path d="M 500 500 Q 700 550 900 400 L 900 100 Q 700 250 500 200 Z" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M 550 280 Q 700 320 850 220" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.5"/>
                <path d="M 550 330 Q 700 370 850 270" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.5"/>
                <path d="M 550 380 Q 700 420 850 320" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.5"/>
                <path d="M 550 430 Q 700 470 800 380" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.5"/>
              </g>
            </g>
            <path className="animate-[pulse_2s_ease-in-out_infinite]" d="M 300 50 L 310 80 L 340 90 L 310 100 L 300 130 L 290 100 L 260 90 L 290 80 Z" fill="currentColor"/>
            <path className="animate-[pulse_3s_ease-in-out_infinite]" d="M 700 80 L 705 100 L 725 105 L 705 110 L 700 130 L 695 110 L 675 105 L 695 100 Z" fill="currentColor"/>
            <path className="animate-[pulse_2.5s_ease-in-out_infinite]" d="M 500 20 L 505 40 L 525 45 L 505 50 L 500 70 L 495 50 L 475 45 L 495 40 Z" fill="currentColor"/>
          </svg>
      </div>

      {/* ——— HERO ——— */}
      <section className="relative pt-20 pb-32 px-6 md:px-margin-desktop max-w-[1280px] mx-auto text-center">
        <div className="absolute inset-0 crosshatch-bg opacity-5 -z-10 pointer-events-none" />

        {/* Hero text */}
        <div className="max-w-3xl mx-auto space-y-8 relative">
          <div className="inline-flex items-center gap-2 etched-border bg-white shadow-hard-sm px-4 py-1.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="font-sans font-bold text-xs uppercase tracking-widest text-on-surface-variant">StudyLM · Public Beta</span>
          </div>

          <h1 className="font-serif text-display-lg-mobile md:text-display-lg text-on-surface leading-tight">
            Supercharge your study with<br /><span className="text-primary">AI-generated</span> roadmaps.
          </h1>

          <p className="font-sans text-body-lg text-on-surface-variant max-w-xl mx-auto">
            Transform raw sources into intelligent study materials. StudyLM bridges the gap between chaotic documentation and academic mastery.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link
              to="/register"
              className="bg-primary-container text-on-primary-container px-8 py-4 etched-border shadow-hard btn-press font-sans font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2"
            >
              Start Your Journey
              <span className="material-symbols-outlined text-[18px]">north_east</span>
            </Link>
            <a
              href="#process"
              className="bg-transparent text-on-surface px-8 py-4 etched-border shadow-hard btn-press font-sans font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2"
            >
              View Methods
            </a>
          </div>
        </div>

        {/* 3-column workspace UI mockup — etched redesign */}
        <div className="mt-40 w-full max-w-5xl mx-auto etched-border shadow-hard overflow-hidden flex flex-col">
          {/* Chrome bar */}
          <div className="h-10 bg-surface-container border-b border-outline-variant flex items-center px-4 gap-3 shrink-0">
            <span className="font-serif font-bold text-sm text-primary">StudyLM</span>
            <div className="h-5 flex-1 max-w-[180px] bg-white border border-outline-variant/50" />
          </div>

          <div className="flex h-[460px] w-full text-left">
            {/* Column 1: Sources */}
            <div className="w-52 border-r border-outline-variant bg-surface-container-lowest flex flex-col p-4 gap-3 shrink-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-sans font-bold text-[10px] uppercase tracking-widest text-outline">Sources</span>
                <span className="material-symbols-outlined text-primary text-[16px]">add_circle</span>
              </div>
              <div className="p-3 etched-border bg-white shadow-hard-sm flex flex-col gap-2">
                <span className="material-symbols-outlined text-outline text-[18px]">picture_as_pdf</span>
                <div className="h-2 w-20 bg-on-surface/20 rounded-sm" />
                <div className="h-1.5 w-10 bg-outline-variant/50 rounded-sm" />
              </div>
              <div className="p-3 etched-border bg-white shadow-hard-sm flex flex-col gap-2">
                <span className="material-symbols-outlined text-outline text-[18px]">description</span>
                <div className="h-2 w-24 bg-on-surface/20 rounded-sm" />
                <div className="h-1.5 w-12 bg-outline-variant/50 rounded-sm" />
              </div>
              <div className="mt-auto">
                <div className="w-full py-2 etched-border bg-primary-container text-on-primary-container font-sans font-bold text-[9px] uppercase tracking-widest text-center shadow-hard-sm">
                  Add Source
                </div>
              </div>
            </div>

            {/* Column 2: Chat */}
            <div className="flex-1 flex flex-col bg-background border-r border-outline-variant overflow-hidden">
              <div className="px-4 py-3 border-b border-outline-variant bg-white flex justify-between items-center shrink-0">
                <div>
                  <div className="font-serif font-semibold text-sm text-on-surface">Academic Assistant</div>
                  <div className="text-[10px] text-outline font-sans">Analyzing 2 sources</div>
                </div>
                <span className="material-symbols-outlined text-outline text-[18px]">more_horiz</span>
              </div>
              <div className="flex-1 p-5 flex flex-col gap-5 overflow-hidden">
                {/* AI bubble */}
                <div className="flex flex-col max-w-[85%] self-start">
                  <div className="etched-border bg-white p-3 relative">
                    <div className="space-y-1.5">
                      <div className="h-2 w-full bg-on-surface/15 rounded-sm" />
                      <div className="h-2 w-[90%] bg-on-surface/15 rounded-sm" />
                      <div className="h-2 w-4/5 bg-on-surface/15 rounded-sm" />
                    </div>
                    <div
                      className="absolute -left-1.5 top-3 w-3 h-3 bg-white rotate-45"
                      style={{ borderLeft: '1px solid #1b1c1c', borderBottom: '1px solid #1b1c1c' }}
                    />
                  </div>
                  <span className="text-[9px] mt-1 uppercase font-bold text-outline-variant font-sans px-1">StudyLM</span>
                </div>
                {/* User bubble */}
                <div className="flex flex-col max-w-[75%] self-end">
                  <div className="etched-border bg-primary p-3 relative">
                    <div className="space-y-1.5">
                      <div className="h-2 w-full bg-white/30 rounded-sm" />
                      <div className="h-2 w-3/4 bg-white/30 rounded-sm" />
                    </div>
                    <div className="absolute -right-1.5 top-3 w-3 h-3 bg-primary rotate-45" />
                  </div>
                  <span className="text-[9px] mt-1 uppercase font-bold text-outline-variant self-end font-sans px-1">You</span>
                </div>
                {/* AI bubble 2 */}
                <div className="flex flex-col max-w-[85%] self-start">
                  <div className="etched-border bg-white p-3 relative">
                    <div className="space-y-1.5">
                      <div className="h-2 w-full bg-on-surface/15 rounded-sm" />
                      <div className="h-2 w-4/5 bg-on-surface/15 rounded-sm" />
                    </div>
                    <div
                      className="absolute -left-1.5 top-3 w-3 h-3 bg-white rotate-45"
                      style={{ borderLeft: '1px solid #1b1c1c', borderBottom: '1px solid #1b1c1c' }}
                    />
                  </div>
                  <span className="text-[9px] mt-1 uppercase font-bold text-outline-variant font-sans px-1">StudyLM</span>
                </div>
              </div>
              <div className="p-4 border-t border-outline-variant bg-white shrink-0">
                <div className="flex gap-3 items-center">
                  <div className="flex-1 etched-border bg-surface-container-lowest h-10" />
                  <div className="w-10 h-10 etched-border bg-primary flex items-center justify-center shadow-hard shrink-0">
                    <span className="material-symbols-outlined text-white text-[16px]">send</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3: Study Roadmap */}
            <div className="w-56 bg-surface-container-low flex flex-col p-5 gap-4 shrink-0 overflow-hidden">
              <div className="mb-1 shrink-0">
                <div className="text-[9px] uppercase font-bold tracking-widest text-outline font-sans">Generated Asset</div>
                <div className="font-serif font-semibold text-sm text-on-surface mt-0.5">Study Roadmap</div>
              </div>
              <div className="relative pl-6 flex-1">
                <div className="absolute left-[8px] top-3 bottom-3 w-px dashed-line opacity-40" />
                {/* Phase 1 - finished */}
                <div className="relative mb-4">
                  <div className="absolute -left-[20px] top-1 w-4 h-4 rounded-full bg-primary etched-border flex items-center justify-center shadow-hard-sm">
                    <span className="material-symbols-outlined text-white text-[9px]">check</span>
                  </div>
                  <div className="bg-white etched-border p-2.5 shadow-hard-sm">
                    <div className="text-[8px] font-bold uppercase text-primary font-sans mb-1">Phase 1</div>
                    <div className="h-1.5 w-full bg-on-surface/20 rounded-sm mb-1" />
                    <div className="h-1.5 w-4/5 bg-on-surface/20 rounded-sm" />
                  </div>
                </div>
                {/* Phase 2 - active */}
                <div className="relative mb-4">
                  <div className="absolute -left-[20px] top-1 w-4 h-4 rounded-full bg-white etched-border flex items-center justify-center shadow-hard-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  </div>
                  <div className="bg-white etched-border p-2.5 shadow-hard-sm">
                    <div className="text-[8px] font-bold uppercase text-primary font-sans mb-1">Phase 2</div>
                    <div className="h-1.5 w-full bg-on-surface/20 rounded-sm mb-1" />
                    <div className="h-1.5 w-3/4 bg-on-surface/20 rounded-sm" />
                  </div>
                </div>
                {/* Phase 3 - action */}
                <div className="relative">
                  <div className="absolute -left-[20px] top-1 w-4 h-4 rounded-full bg-white etched-border flex items-center justify-center shadow-hard-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-outline-variant" />
                  </div>
                  <div className="bg-primary-container border border-dashed border-on-surface p-2.5 shadow-hard">
                    <div className="text-[8px] font-bold uppercase text-on-primary-container font-sans opacity-70 mb-1">Phase 3</div>
                    <div className="h-1.5 w-full bg-on-primary-container/20 rounded-sm mb-1" />
                    <div className="h-1.5 w-2/3 bg-on-primary-container/20 rounded-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ——— PROCESS ——— */}
      <section id="process" className="bg-surface-container py-24 px-6 md:px-margin-desktop">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-16">
            <span className="font-sans font-bold text-xs uppercase tracking-widest text-primary">The Process</span>
            <h2 className="font-serif text-headline-lg text-on-surface mt-2">From Documents to Mastery</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: 'upload_file', title: 'Upload Sources', desc: 'Import your PDFs, notes, and research papers into your private secure notebook.' },
              { icon: 'forum', title: 'Chat with AI', desc: 'Interrogate your documents with scholarly precision using our context-aware assistant.' },
              { icon: 'auto_stories', title: 'Master Topics', desc: 'Generate quizzes, structured study plans, and knowledge checks tailored to your materials.' },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-white p-8 etched-border shadow-hard hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard-lg transition-all flex flex-col items-center text-center"
              >
                <span
                  className="material-symbols-outlined text-4xl text-on-surface mb-6"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {icon}
                </span>
                <h3 className="font-serif text-headline-md mb-3">{title}</h3>
                <p className="font-sans text-sm text-on-surface-variant leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— FEATURE SECTIONS ——— */}
      <section className="py-24 px-6 md:px-margin-desktop max-w-[1280px] mx-auto overflow-hidden">

        {/* AI Reading Assistant */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="font-sans font-bold text-xs uppercase tracking-widest text-primary">Assistant</span>
            <h2 className="font-serif text-headline-lg text-on-surface mt-2 mb-6">AI Reading Assistant</h2>
            <p className="font-sans text-body-lg text-on-surface-variant mb-8">
              Never read alone. Our AI partner highlights key arguments, identifies cross-references between sources, and clarifies complex terminology in real-time as you read.
            </p>
            <ul className="space-y-4">
              {[
                'Contextual summary of long-form chapters.',
                'Instant definition of academic jargon.',
                'Source cross-referencing and citation links.',
              ].map(text => (
                <li key={text} className="flex items-start gap-3">
                  <span
                    className="material-symbols-outlined text-primary shrink-0"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  <span className="font-sans text-body-md">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Decorative: reading/document card */}
          <div className="relative">
            <div className="bg-white etched-border shadow-hard p-8 rotate-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 etched-border flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[28px] text-primary">auto_stories</span>
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="h-2.5 w-3/4 bg-on-surface/20 rounded-sm" />
                  <div className="h-2 w-1/2 bg-outline-variant/40 rounded-sm" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-2.5 w-full bg-on-surface/15 rounded-sm" />
                <div className="h-2.5 w-[95%] bg-on-surface/15 rounded-sm" />
                <div className="h-2.5 w-4/5 bg-on-surface/15 rounded-sm" />
                <div className="h-2.5 bg-primary-container/70 w-3/5 rounded-sm" />
                <div className="h-2.5 w-[90%] bg-on-surface/15 rounded-sm" />
                <div className="h-2.5 w-2/3 bg-on-surface/15 rounded-sm" />
              </div>
              <div className="mt-6 pt-4 border-t border-outline-variant flex gap-2">
                <div className="etched-border px-3 py-1.5 text-[10px] font-bold uppercase font-sans text-primary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">auto_stories</span>
                  See Source
                </div>
                <div className="etched-border px-3 py-1.5 text-[10px] font-bold uppercase font-sans text-outline flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">link</span>
                  Citation
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary-container/20 etched-border -z-10" />
          </div>
        </div>

        {/* Active Recall Engine */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mt-32">
          {/* Decorative: quiz card */}
          <div className="relative order-2 lg:order-1">
            <div className="bg-white etched-border shadow-hard p-8 -rotate-2">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="font-sans font-bold text-[10px] uppercase tracking-widest text-primary mb-1">Active Recall</div>
                  <div className="font-serif text-lg text-on-surface">Knowledge Check</div>
                </div>
                <div className="etched-border px-3 py-1 text-[10px] font-bold uppercase font-sans bg-primary-fixed text-on-primary-fixed rotate-2">
                  +20 XP
                </div>
              </div>
              <p className="font-serif text-base text-on-surface mb-5 leading-snug">
                What is the primary mechanism of incentive salience?
              </p>
              <div className="space-y-2.5">
                <div className="p-3 etched-border flex items-center gap-3 text-sm font-sans opacity-40">
                  <span className="material-symbols-outlined text-sm shrink-0">radio_button_unchecked</span>
                  Executive mood regulation
                </div>
                <div className="p-3 bg-error-container etched-border flex items-center gap-3 text-sm font-sans text-on-error-container">
                  <span className="material-symbols-outlined text-sm shrink-0">cancel</span>
                  Dopamine burst from VTA
                </div>
                <div className="p-3 bg-primary-container etched-border flex items-center gap-3 text-sm font-sans text-on-primary-container">
                  <span className="material-symbols-outlined text-sm shrink-0">check_circle</span>
                  Reward prediction error
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-primary-container/20 etched-border -z-10" />
          </div>

          <div className="order-1 lg:order-2">
            <span className="font-sans font-bold text-xs uppercase tracking-widest text-primary">Retention</span>
            <h2 className="font-serif text-headline-lg text-on-surface mt-2 mb-6">Active Recall Engine</h2>
            <p className="font-sans text-body-lg text-on-surface-variant mb-8">
              Stop passive highlighting. StudyLM generates dynamic quizzes and knowledge checks based on your specific research material, ensuring you retain the most critical information.
            </p>
            <ul className="space-y-4">
              {[
                'Spaced repetition scheduling for optimal memory.',
                'Socratic questioning to deepen understanding.',
                'Difficulty-graded modules from Easy to Hard.',
              ].map(text => (
                <li key={text} className="flex items-start gap-3">
                  <span
                    className="material-symbols-outlined text-primary shrink-0"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  <span className="font-sans text-body-md">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ——— CTA ——— */}
      <section className="py-24 px-6 md:px-margin-desktop bg-surface-container-high">
        <div className="max-w-3xl mx-auto text-center space-y-10">
          <div className="inline-block p-4 etched-border bg-white shadow-hard -rotate-3">
            <span className="material-symbols-outlined text-5xl">school</span>
          </div>
          <h2 className="font-serif text-display-lg-mobile md:text-display-lg text-on-surface">
            Join the community<br />of scholars.
          </h2>
          <p className="font-sans text-body-lg text-on-surface-variant">
            Ready to transform your research into a masterpiece of understanding? Join students and researchers who have found their way with StudyLM.
          </p>
          <div>
            <Link
              to="/register"
              className="inline-flex bg-primary-container text-on-primary-container px-12 py-5 etched-border shadow-hard btn-press font-sans font-bold uppercase tracking-widest text-sm"
            >
              Create Your Free Account
            </Link>
            <p className="mt-4 font-sans text-xs text-on-surface-variant uppercase tracking-widest">
              No credit card required. Scholarly ethics guaranteed.
            </p>
          </div>
        </div>
      </section>

      {/* ——— FOOTER ——— */}
      <footer className="w-full border-t border-outline-variant bg-surface-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-6 md:px-margin-desktop py-12 max-w-[1280px] mx-auto">
          <div>
            <span className="font-serif text-headline-md text-on-surface mb-3 block">StudyLM</span>
            <p className="font-sans text-sm text-on-surface-variant">
              © {new Date().getFullYear()} StudyLM. Scholarly tools for the modern academic.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-sans font-bold text-xs uppercase tracking-widest text-primary">Quick Links</span>
            <a href="#process" className="font-sans text-sm text-on-surface-variant hover:text-primary transition-colors hover:underline underline-offset-4">Methods</a>
            <Link to="/login" className="font-sans text-sm text-on-surface-variant hover:text-primary transition-colors hover:underline underline-offset-4">Sign In</Link>
            <Link to="/register" className="font-sans text-sm text-on-surface-variant hover:text-primary transition-colors hover:underline underline-offset-4">Get Started</Link>
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-sans font-bold text-xs uppercase tracking-widest text-primary">Legal</span>
            <span className="font-sans text-sm text-on-surface-variant">Privacy Policy</span>
            <span className="font-sans text-sm text-on-surface-variant">Terms of Service</span>
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-sans font-bold text-xs uppercase tracking-widest text-primary">Support</span>
            <span className="font-sans text-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Contact</span>
            <div className="flex gap-3 mt-1">
              <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">share</span>
              <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">mail</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
