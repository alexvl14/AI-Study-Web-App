import { useState } from 'react';
import type { StudyPlanResponse } from '../../types/notebook';
import api from '../../services/api';

interface StudyPlanSidebarProps {
  notebookId?: string;
  studyPlans: StudyPlanResponse[];
  onOpenTopic: (plan: StudyPlanResponse) => void;
  onRefresh: () => void;
  onPlanGenerated?: (planId: number) => void;
}

export default function StudyPlanSidebar({ notebookId, studyPlans, onOpenTopic, onRefresh, onPlanGenerated }: StudyPlanSidebarProps) {
  const [generatingId, setGeneratingId] = useState<number | null>(null);
  const [isGeneratingSyllabus, setIsGeneratingSyllabus] = useState(false);

  // Sort study plans by sequence order
  const sortedPlans = [...studyPlans].sort((a, b) => a.sequenceOrder - b.sequenceOrder);
  
  const handleGenerate = async (e: React.MouseEvent, planId: number) => {
    e.stopPropagation();
    if (!notebookId) return;
    try {
      setGeneratingId(planId);
      await api.post(`/notebooks/${notebookId}/study-plans/${planId}/generate-context`);
      if (onPlanGenerated) {
        onPlanGenerated(planId);
      } else {
        onRefresh();
      }
    } catch (error: any) {
      console.error('Failed to generate study plan context:', error);
      const errorMsg = error.response?.data?.detail || error.response?.data?.message || error.response?.data || error.message || 'Unknown error';
      alert(`Failed to generate study plan context. Details: ${typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg)}`);
    } finally {
      setGeneratingId(null);
    }
  };

  const handleGenerateSyllabus = async () => {
    if (!notebookId) return;
    try {
      setIsGeneratingSyllabus(true);
      await api.post(`/notebooks/${notebookId}/study-plans/generateSyllabus`);
      onRefresh();
    } catch (error: any) {
      console.error('Failed to generate syllabus:', error);
      const errorMsg = error.response?.data?.detail || error.response?.data?.message || error.response?.data || error.message || 'Unknown error';
      alert(`Failed to generate syllabus. Details: ${typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg)}`);
    } finally {
      setIsGeneratingSyllabus(false);
    }
  };

  return (
    <aside className="w-full bg-surface flex flex-col p-4 lg:p-8 overflow-y-auto hide-scrollbar pb-32 lg:pb-8">
      <div className="mb-8 relative">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">auto_stories</span>
            <span className="font-manrope uppercase tracking-widest text-[10px] font-bold text-on-surface-variant opacity-60">Personalized Roadmap</span>
          </div>
          {sortedPlans.length > 0 && (
            <button 
              onClick={handleGenerateSyllabus}
              disabled={isGeneratingSyllabus}
              className="bg-surface-container-highest hover:bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
            >
              {isGeneratingSyllabus ? (
                <><span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span> Regenerating...</>
              ) : (
                <><span className="material-symbols-outlined text-[14px]">refresh</span> Regenerate</>
              )}
            </button>
          )}
        </div>
        <p className="text-xs text-on-surface-variant leading-relaxed">Based on your learning objectives and uploaded material.</p>
      </div>

      {/* Timeline */}
      <div className="relative pl-4 space-y-12 mb-8">
        {/* Vertical Line */}
        {sortedPlans.length > 0 && (
          <div className="absolute left-[23px] top-2 bottom-2 w-0.5 bg-outline-variant/30"></div>
        )}

        {sortedPlans.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary shadow-inner">
              <span className="material-symbols-outlined text-4xl">account_tree</span>
            </div>
            <h3 className="text-lg font-bold text-on-surface mb-2">No Study Plan Yet</h3>
            <p className="text-sm text-on-surface-variant mb-8 max-w-[200px] leading-relaxed">Let the AI analyze your sources and generate a personalized roadmap.</p>
            <button 
              onClick={handleGenerateSyllabus}
              disabled={isGeneratingSyllabus}
              className="bg-primary text-on-primary px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center gap-2"
            >
              {isGeneratingSyllabus ? (
                <><span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span> Generating...</>
              ) : (
                <><span className="material-symbols-outlined text-[20px]">magic_button</span> Generate Syllabus</>
              )}
            </button>
          </div>
        ) : (
          sortedPlans.map((plan) => {
            const isGenerated = plan.isGenerated === 1 || (plan.isGenerated as any) === true || (plan.isGenerated as any) === '1';
            const isGeneratingThis = generatingId === plan.id;

            return isGenerated ? (
              <div key={plan.id} className="relative flex gap-6 group cursor-pointer" onClick={() => onOpenTopic(plan)}>
                <div className="z-10 w-5 h-5 rounded-full bg-primary ring-4 ring-primary/20 flex items-center justify-center shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
                <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-primary/20 flex-1 hover:border-primary/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">Module {plan.sequenceOrder}</span>
                    <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">Ready</span>
                  </div>
                  <h3 className="font-bold text-sm text-on-surface mb-1">{plan.title}</h3>
                  <p className="text-xs text-on-surface-variant mb-4 line-clamp-2">{plan.description}</p>
                  <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full w-[0%]"></div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[9px] font-bold text-on-surface-variant">Not started</span>
                  </div>
                </div>
              </div>
            ) : (
              <div key={plan.id} className="relative flex gap-6">
                <div className="z-10 w-5 h-5 rounded-full bg-surface-container-highest border-2 border-outline-variant flex items-center justify-center shrink-0 mt-1">
                </div>
                <div className="p-5 rounded-2xl bg-surface-container-low/50 border border-outline-variant/10 transition-colors flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter opacity-60">Module {plan.sequenceOrder}</span>
                    <span className="text-[10px] font-medium text-on-surface-variant bg-surface-container-highest px-2 py-0.5 rounded-full">Locked</span>
                  </div>
                  <h3 className="font-bold text-sm text-on-surface/80 mb-1">{plan.title}</h3>
                  <p className="text-xs text-on-surface-variant/80 line-clamp-2 mb-4">{plan.description}</p>
                  <div className="mt-auto pt-2">
                    <button 
                      onClick={(e) => handleGenerate(e, plan.id)}
                      disabled={generatingId !== null}
                      className="w-full bg-surface-container-highest hover:bg-primary hover:text-on-primary text-on-surface text-xs font-bold py-2 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:bg-surface-container-highest disabled:hover:text-on-surface"
                    >
                      {isGeneratingThis ? (
                        <>
                          <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                          Generating Lesson...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[16px]">magic_button</span>
                          Generate Lesson
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Goal Summary Card */}
      {sortedPlans.length > 0 && (
        <div className="mt-auto">
          <div className="bg-gradient-to-br from-primary to-primary-container p-6 rounded-3xl text-on-primary shadow-lg shadow-primary/10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Overall Progress</p>
                <h4 className="text-xl font-bold">Ready to start</h4>
              </div>
              <span className="material-symbols-outlined text-3xl opacity-50">trophy</span>
            </div>
            <p className="text-xs opacity-90 leading-relaxed mb-4">You have {sortedPlans.length} modules to cover in this notebook. Let's get started!</p>
            <button className="w-full bg-white/20 backdrop-blur-md text-white py-2.5 rounded-xl text-xs font-bold hover:bg-white/30 transition-all">
              View Detailed Stats
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
