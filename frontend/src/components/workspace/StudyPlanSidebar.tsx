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

  const formatTimeSpan = (timeStr?: string) => {
    if (!timeStr || timeStr === '00:00:00') return '0s';
    let days = 0;
    let timePart = timeStr;
    if (timeStr.includes('.') && timeStr.indexOf('.') < timeStr.indexOf(':')) {
      const splitByDot = timeStr.split('.');
      days = parseInt(splitByDot[0]) || 0;
      timePart = splitByDot[1];
    }
    timePart = timePart.split('.')[0];
    const parts = timePart.split(':');
    if (parts.length === 3) {
      const h = parseInt(parts[0]) || 0;
      const m = parseInt(parts[1]) || 0;
      const s = parseInt(parts[2]) || 0;
      let res = '';
      if (days > 0) res += `${days}d `;
      if (h > 0) res += `${h}h `;
      if (m > 0 || days > 0 || h > 0) res += `${m}m `;
      res += `${s}s`;
      return res.trim();
    }
    return timeStr;
  };

  const getDifficultyLabel = (level?: number) => {
    if (level === 0) return 'Easy';
    if (level === 1) return 'Medium';
    if (level === 2) return 'Hard';
    return 'Core';
  };

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
    <aside className="w-full bg-surface-container-low flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="px-8 pt-8 pb-6 border-b border-outline-variant shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-outline font-sans">Generated Asset</span>
            <h2 className="font-serif text-headline-lg text-on-surface mt-1">Study Roadmap</h2>
            <p className="text-sm text-on-surface-variant font-sans mt-1">An algorithmic path through your sources.</p>
          </div>
          {sortedPlans.length > 0 && (
            <button
              onClick={handleGenerateSyllabus}
              disabled={isGeneratingSyllabus}
              className="mt-1 etched-border px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest font-sans text-on-surface hover:bg-surface-container transition-colors disabled:opacity-50 flex items-center gap-1.5 shrink-0"
            >
              {isGeneratingSyllabus ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                  Regen...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">refresh</span>
                  Regenerate
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 px-8 py-6">
        {sortedPlans.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <div className="w-16 h-16 etched-border flex items-center justify-center mb-6 text-primary">
              <span className="material-symbols-outlined text-4xl">account_tree</span>
            </div>
            <h3 className="font-serif text-lg font-semibold text-on-surface mb-2">No Study Plan Yet</h3>
            <p className="text-sm text-on-surface-variant font-sans mb-8 max-w-[200px] leading-relaxed">
              Let the AI analyze your sources and generate a personalized roadmap.
            </p>
            <button
              onClick={handleGenerateSyllabus}
              disabled={isGeneratingSyllabus}
              className="etched-border bg-primary-container text-on-primary-container px-6 py-3 font-sans font-bold text-xs uppercase tracking-widest shadow-hard btn-press flex items-center gap-2 disabled:opacity-50"
            >
              {isGeneratingSyllabus ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                  Generating...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">magic_button</span>
                  Generate Syllabus
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="relative pl-8">
            {/* Dashed vertical timeline line */}
            <div className="absolute left-[11px] top-4 bottom-4 w-px dashed-line opacity-40" />

            {sortedPlans.map((plan) => {
              const isGenerated = plan.isGenerated === 1 || (plan.isGenerated as any) === true || (plan.isGenerated as any) === '1';
              const isGeneratingThis = generatingId === plan.id;

              return (
                <div key={plan.id} className="relative mb-10">
                  {/* Timeline node */}
                  {plan.isFinished ? (
                    <div className="absolute -left-[30px] top-1 w-6 h-6 rounded-full bg-primary etched-border flex items-center justify-center z-10 shadow-hard-sm">
                      <span className="material-symbols-outlined text-white text-xs">check</span>
                    </div>
                  ) : (
                    <div className="absolute -left-[30px] top-1 w-6 h-6 rounded-full bg-white etched-border flex items-center justify-center z-10 shadow-hard-sm">
                      <div className={`w-2 h-2 rounded-full ${isGenerated ? 'bg-primary' : 'bg-outline-variant'}`} />
                    </div>
                  )}

                  {isGenerated ? (
                    /* Generated — clickable card */
                    <div
                      className="bg-white etched-border p-5 shadow-hard-sm hover:shadow-hard transition-all cursor-pointer"
                      onClick={() => onOpenTopic(plan)}
                    >
                      <h5 className="font-sans font-bold uppercase text-xs text-primary mb-1">
                        Phase {plan.sequenceOrder}
                      </h5>
                      <h4 className="font-serif text-base text-on-surface">{plan.title}</h4>
                      <p className="text-xs font-sans mt-2 text-outline line-clamp-2">{plan.description}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="px-2 py-0.5 bg-surface-container-high text-[10px] font-bold uppercase etched-border font-sans">
                          {getDifficultyLabel(plan.difficultyLevel)}
                        </span>
                        {plan.isFinished ? (
                          <span className="px-2 py-0.5 bg-surface-container-high text-[10px] font-bold uppercase etched-border font-sans">
                            {formatTimeSpan(plan.timeItTookToFinish)}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-surface-container-high text-[10px] font-bold uppercase etched-border font-sans">
                            {plan.timeItTookToFinish && plan.timeItTookToFinish !== '00:00:00' ? 'In Progress' : 'Ready'}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Not generated — action card */
                    <div className="bg-primary-container border border-dashed border-on-surface p-5 shadow-hard">
                      <h5 className="font-sans font-bold uppercase text-xs text-on-primary-container opacity-70 mb-1">
                        Phase {plan.sequenceOrder}
                      </h5>
                      <h4 className="font-serif text-base text-on-primary-container">{plan.title}</h4>
                      <p className="text-xs font-sans mt-1 text-on-primary-container opacity-80 line-clamp-2">
                        {plan.description}
                      </p>
                      <button
                        onClick={(e) => handleGenerate(e, plan.id)}
                        disabled={generatingId !== null}
                        className="mt-3 text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1 font-sans disabled:opacity-50"
                      >
                        {isGeneratingThis ? (
                          <>
                            <span className="material-symbols-outlined text-xs animate-spin">progress_activity</span>
                            Generating...
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-xs">magic_button</span>
                            Generate Lesson
                            <span className="material-symbols-outlined text-xs">arrow_forward</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-8 py-6 border-t border-dashed border-outline-variant shrink-0">
        <div className="flex items-center gap-3 opacity-50">
          <span className="material-symbols-outlined text-2xl">verified</span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-tighter font-sans">Verified by StudyLM Engine</p>
            <p className="text-[9px] text-outline font-sans">AI-powered learning roadmap</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
