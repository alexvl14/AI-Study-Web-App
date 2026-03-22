export default function ChatInterface() {
  return (
    <section className="w-full bg-surface-container-lowest flex flex-col relative h-full">
      <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8 hide-scrollbar pb-40 lg:pb-32">
        
        {/* AI Message */}
        <div className="flex gap-4 max-w-[90%] mt-2">
          <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-on-primary-container text-lg">auto_awesome</span>
          </div>
          <div className="space-y-2">
            <div className="bg-surface-container-low p-5 rounded-2xl rounded-tl-none text-on-surface leading-relaxed text-[15px]">
              Hello! I've analyzed your uploaded sources on <span className="text-primary font-semibold">Macroeconomics</span>. I'm ready to help you synthesize these concepts for your upcoming exam. What would you like to focus on first?
            </div>
            <p className="text-[10px] text-on-surface-variant px-1">AI Assistant • Just now</p>
          </div>
        </div>

        {/* User Message */}
        <div className="flex gap-4 max-w-[90%] ml-auto flex-row-reverse">
          <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-on-surface-variant text-lg">person</span>
          </div>
          <div className="space-y-2 text-right">
            <div className="bg-primary text-on-primary p-5 rounded-2xl rounded-tr-none leading-relaxed text-[15px] shadow-md shadow-primary/10">
              Can you explain the relationship between inflation and unemployment as discussed in Chapter 4?
            </div>
            <p className="text-[10px] text-on-surface-variant px-1">You • 1m ago</p>
          </div>
        </div>

        {/* AI Response with sources */}
        <div className="flex gap-4 max-w-[90%]">
          <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-on-primary-container text-lg">auto_awesome</span>
          </div>
          <div className="space-y-2">
            <div className="bg-surface-container-low p-5 rounded-2xl rounded-tl-none text-on-surface leading-relaxed text-[15px]">
              Based on page 112 of <span className="italic">Macroeconomics_Ch4.pdf</span>, this is known as the <strong className="font-bold">Phillips Curve</strong>. It suggests an inverse relationship: when unemployment is low, inflation tends to be high, and vice-versa. 
              <br/><br/>
              Would you like me to generate a visualization of this curve based on the data in your CSV file?
            </div>
            <div className="flex gap-2 mt-2">
              <span className="px-3 py-1 bg-secondary-container/30 text-primary text-[11px] font-bold rounded-full border border-primary/10">Source: PDF Page 112</span>
              <span className="px-3 py-1 bg-secondary-container/30 text-primary text-[11px] font-bold rounded-full border border-primary/10">Source: CSV Data</span>
            </div>
            <p className="text-[10px] text-on-surface-variant px-1">AI Assistant • Just now</p>
          </div>
        </div>
      </div>

      {/* Floating Chat Input */}
      <div className="absolute bottom-24 lg:bottom-6 left-0 right-0 px-4 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white border border-outline-variant/20 shadow-xl shadow-on-surface/5 rounded-2xl p-2 flex items-center gap-2 group focus-within:ring-4 focus-within:ring-primary/5 transition-all">
          <button className="p-2 hover:bg-surface-container rounded-xl text-on-surface-variant transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined">add</span>
          </button>
          <textarea 
            className="flex-1 bg-transparent outline-none border-none focus:ring-0 text-sm py-2 resize-none max-h-32 hide-scrollbar" 
            placeholder="Ask StudyLM anything about your sources..." 
            rows={1}
          ></textarea>
          <div className="flex items-center gap-1 pr-1">
            <button className="p-2 hover:bg-surface-container rounded-xl text-on-surface-variant transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined">mic</span>
            </button>
            <button className="bg-primary text-on-primary p-2 rounded-xl hover:bg-primary-container transition-all shadow-sm flex items-center justify-center">
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
