import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import ReactMarkdown from 'react-markdown';
import api from '../../services/api';
import type { StudyPlanResponse } from '../../types/notebook';

interface StudyPlanDrawerProps {
  notebookId: string;
  planId: number;
  onClose: () => void;
  onRefresh: () => void;
}

export default function StudyPlanDrawer({ notebookId, planId, onClose, onRefresh }: StudyPlanDrawerProps) {
  const [plan, setPlan] = useState<StudyPlanResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [localSeconds, setLocalSeconds] = useState<number>(0);

  const parseTimeSpanToSeconds = (timeStr?: string) => {
    if (!timeStr || timeStr === "00:00:00") return 0;
    
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
      return (days * 86400) + (h * 3600) + (m * 60) + s;
    }
    return 0;
  };

  const formatSeconds = (totalSeconds: number) => {
    if (totalSeconds === 0) return "0s";
    const days = Math.floor(totalSeconds / 86400);
    const h = Math.floor((totalSeconds % 86400) / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    
    let res = '';
    if (days > 0) res += `${days}d `;
    if (h > 0) res += `${h}h `;
    if (m > 0 || days > 0 || h > 0) res += `${m}m `;
    res += `${s}s`;
    return res.trim();
  };

  // Visual timer effect
  useEffect(() => {
    if (!plan || plan.isFinished) return;
    
    const intervalId = setInterval(() => {
      setLocalSeconds(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [plan?.isFinished, plan !== null]);

  // Timer effect to track and save time spent
  useEffect(() => {
    if (!plan || plan.isFinished) return;
    
    let lastSavedTime = Date.now();
    let isUnmounted = false;
    
    const saveTime = async (isFinalSave = false) => {
      if (isUnmounted && !isFinalSave) return;
      const now = Date.now();
      const secondsSpent = Math.floor((now - lastSavedTime) / 1000);
      
      if (secondsSpent >= 1) {
        try {
          const response = await api.post(`/notebooks/${notebookId}/study-plans/${planId}/timer?secondsSpent=${secondsSpent}`);
          lastSavedTime = now;
          if (response.data && response.data.time && !isUnmounted) {
            setPlan(prev => prev ? { ...prev, timeItTookToFinish: response.data.time } : prev);
          }
        } catch (err) {
          console.error("Failed to save time spent:", err);
        }
      }
    };

    const intervalId = setInterval(() => saveTime(false), 60000);

    return () => {
      isUnmounted = true;
      clearInterval(intervalId);
      saveTime(true); // Save any remaining time when component unmounts
    };
  }, [notebookId, planId, plan?.isFinished]);

  useEffect(() => {
    const fetchPlan = async () => {
      setLoading(true);
      setError(null);
      setQuizScore(null);
      setSelectedAnswers({});
      try {
        const response = await api.get(`/notebooks/${notebookId}/study-plans/${planId}`);
        const data = response.data;
        setPlan(data);
        if (data.timeItTookToFinish) {
          setLocalSeconds(parseTimeSpanToSeconds(data.timeItTookToFinish));
        }
        
        // If quiz is already completed, set the selected answers
        if (data.isQuizCompleted && data.questions) {
          const answers: Record<number, number> = {};
          data.questions.forEach((q: any) => {
            const selectedOpt = q.options?.find((o: any) => o.isSelectedByUser);
            if (selectedOpt) {
              answers[q.id] = selectedOpt.id;
            }
          });
          setSelectedAnswers(answers);
        }
      } catch (err: any) {
        console.error('Failed to load study plan:', err);
        setError(err.response?.data?.message || err.response?.data || 'Failed to load study plan module.');
      } finally {
        setLoading(false);
      }
    };

    if (planId) {
      fetchPlan();
    }
  }, [notebookId, planId]);

  const handleOptionSelect = (questionId: number, optionId: number) => {
    if (plan?.isQuizCompleted || submitting) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmitQuiz = async () => {
    if (!plan?.questions || submitting) return;
    
    // Ensure all questions are answered
    if (Object.keys(selectedAnswers).length < plan.questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.post(`/notebooks/${notebookId}/study-plans/${planId}/quiz`, {
        answers: selectedAnswers
      });
      setQuizScore(response.data.score);
      onRefresh(); // Refresh the sidebar to update total notebook progress if needed
    } catch (err: any) {
      console.error('Failed to submit quiz:', err);
      alert(err.response?.data?.message || err.response?.data || 'Failed to submit quiz.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return createPortal(
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 lg:p-8 backdrop-blur-sm" onClick={onClose}>
        <div 
          className="bg-surface w-full max-w-6xl max-h-full rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-6 border-b border-outline-variant/10">
            <div className="h-6 w-32 bg-surface-container-high rounded animate-pulse"></div>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-surface-container-highest hover:bg-error/10 hover:text-error flex items-center justify-center text-on-surface-variant transition-colors ml-4 shrink-0 shadow-sm">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-primary/50 min-h-[400px]">
            <span className="material-symbols-outlined text-4xl animate-spin mb-4">progress_activity</span>
            <p className="text-sm font-bold tracking-widest uppercase">Loading Module</p>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  if (error || !plan) {
    return createPortal(
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 lg:p-8 backdrop-blur-sm" onClick={onClose}>
        <div 
          className="bg-surface w-full max-w-6xl max-h-full rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-6 border-b border-outline-variant/10">
            <h2 className="text-xl font-bold text-on-surface">Error</h2>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-surface-container-highest hover:bg-error/10 hover:text-error flex items-center justify-center text-on-surface-variant transition-colors ml-4 shrink-0 shadow-sm">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
            <span className="material-symbols-outlined text-4xl text-error mb-4">error</span>
            <p className="text-on-surface-variant mb-4">{error}</p>
            <button onClick={onClose} className="bg-primary text-on-primary px-6 py-2 rounded-xl font-bold">Close</button>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 lg:p-8 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-surface w-full max-w-6xl max-h-full rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-outline-variant/10 shrink-0">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">Module {plan.sequenceOrder}</span>
              {plan.isFinished ? (
                <span className="text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">done_all</span>
                  Completed in {formatSeconds(localSeconds)}
                </span>
              ) : (
                <span className="text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">schedule</span>
                  In Progress ({formatSeconds(localSeconds)})
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-on-surface line-clamp-1" title={plan.title}>{plan.title}</h2>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-surface-container-highest hover:bg-error/10 hover:text-error flex items-center justify-center text-on-surface-variant transition-colors ml-4 shrink-0 shadow-sm"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      
      <div className="flex-1 overflow-y-auto p-6 hide-scrollbar bg-white dark:bg-slate-900">
        <div className="prose prose-slate dark:prose-invert prose-sm max-w-none prose-headings:font-bold prose-a:text-primary prose-strong:text-on-surface">
          <ReactMarkdown>{plan.content || "*No content available.*"}</ReactMarkdown>
        </div>
        
        {plan.questions && plan.questions.length > 0 && (
          <div className="mt-12 pt-8 border-t border-outline-variant/20">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-primary text-xl">quiz</span>
              <h4 className="text-lg font-bold text-on-surface m-0">Knowledge Check</h4>
            </div>
            
            {(plan.isQuizCompleted || quizScore !== null) && (
              <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-primary mb-1">Quiz Completed!</h5>
                  <p className="text-xs text-on-surface-variant">Review your answers below.</p>
                </div>
                {quizScore !== null && (
                  <div className="text-2xl font-black text-primary">
                    {quizScore}/{plan.questions.length}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-8">
              {plan.questions.map((q, index) => (
                <div key={q.id} className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 shadow-sm">
                  <p className="font-bold text-sm text-on-surface mb-4">
                    <span className="text-primary mr-2">{index + 1}.</span>
                    {q.questionText}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((opt) => {
                      const isSelected = selectedAnswers[q.id] === opt.id;
                      const showResults = plan.isQuizCompleted || quizScore !== null;
                      
                      let btnClass = "w-full text-left p-3 rounded-xl border transition-all text-sm flex items-center justify-between ";
                      
                      if (showResults) {
                        if (opt.isCorrect) {
                          btnClass += "border-green-500 bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-100 ring-1 ring-green-500";
                        } else if (isSelected && !opt.isCorrect) {
                          btnClass += "border-red-500 bg-red-50 text-red-900 dark:bg-red-900/20 dark:text-red-100 ring-1 ring-red-500";
                        } else {
                          btnClass += "border-outline-variant/20 opacity-50";
                        }
                      } else {
                        if (isSelected) {
                          btnClass += "border-primary bg-primary/5 text-primary ring-1 ring-primary font-medium";
                        } else {
                          btnClass += "border-outline-variant/30 hover:border-primary/50 hover:bg-surface-container text-on-surface-variant";
                        }
                      }

                      return (
                        <button 
                          key={opt.id}
                          onClick={() => handleOptionSelect(q.id, opt.id)}
                          disabled={showResults || submitting}
                          className={btnClass}
                        >
                          <span>{opt.optionText}</span>
                          {showResults && opt.isCorrect && <span className="material-symbols-outlined text-green-600 text-sm">check_circle</span>}
                          {showResults && isSelected && !opt.isCorrect && <span className="material-symbols-outlined text-red-600 text-sm">cancel</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            
            {!plan.isQuizCompleted && quizScore === null && (
              <div className="mt-8">
                <button
                  onClick={handleSubmitQuiz}
                  disabled={submitting || Object.keys(selectedAnswers).length < plan.questions.length}
                  className="w-full bg-primary text-on-primary py-3 rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none flex justify-center items-center gap-2"
                >
                  {submitting ? (
                    <><span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span> Submitting...</>
                  ) : (
                    <><span className="material-symbols-outlined text-[20px]">send</span> Submit Quiz</>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      </div>
    </div>,
    document.body
  );
}
