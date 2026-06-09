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
  const [finishing, setFinishing] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [localSeconds, setLocalSeconds] = useState<number>(0);

  const parseTimeSpanToSeconds = (timeStr?: string) => {
    if (!timeStr || timeStr === '00:00:00') return 0;
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
    if (totalSeconds === 0) return '0s';
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

  const getDifficultyLabel = (level?: number) => {
    if (level === 0) return 'Easy';
    if (level === 1) return 'Medium';
    if (level === 2) return 'Hard';
    return 'Core';
  };

  // Visual timer
  useEffect(() => {
    if (!plan || plan.isFinished) return;
    const intervalId = setInterval(() => {
      setLocalSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [plan?.isFinished, plan !== null]);

  // Time-tracking: save elapsed time periodically and on unmount
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
          if (response.data?.time && !isUnmounted) {
            setPlan(prev => prev ? { ...prev, timeItTookToFinish: response.data.time } : prev);
          }
        } catch (err) {
          console.error('Failed to save time spent:', err);
        }
      }
    };

    const intervalId = setInterval(() => saveTime(false), 60000);
    return () => {
      isUnmounted = true;
      clearInterval(intervalId);
      saveTime(true);
    };
  }, [notebookId, planId, plan?.isFinished]);

  // Fetch plan on mount
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
        if (data.isQuizCompleted && data.questions) {
          const answers: Record<number, number> = {};
          data.questions.forEach((q: any) => {
            const selectedOpt = q.options?.find((o: any) => o.isSelectedByUser);
            if (selectedOpt) answers[q.id] = selectedOpt.id;
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

    if (planId) fetchPlan();
  }, [notebookId, planId]);

  const handleOptionSelect = (questionId: number, optionId: number) => {
    if (plan?.isQuizCompleted || submitting) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmitQuiz = async () => {
    if (!plan?.questions || submitting) return;
    if (Object.keys(selectedAnswers).length < plan.questions.length) {
      alert('Please answer all questions before submitting.');
      return;
    }
    try {
      setSubmitting(true);
      const response = await api.post(`/notebooks/${notebookId}/study-plans/${planId}/quiz`, {
        answers: selectedAnswers,
      });
      setQuizScore(response.data.score);
      onRefresh();
    } catch (err: any) {
      console.error('Failed to submit quiz:', err);
      alert(err.response?.data?.message || err.response?.data || 'Failed to submit quiz.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinishModule = async () => {
    if (!plan || plan.isFinished || finishing) return;
    try {
      setFinishing(true);
      await api.post(`/notebooks/${notebookId}/study-plans/${planId}/finish`);
      setPlan(prev => prev ? { ...prev, isFinished: true } : prev);
      onRefresh();
    } catch (err: any) {
      console.error('Failed to finish module:', err);
      alert(err.response?.data?.message || err.response?.data || 'Failed to finish module.');
    } finally {
      setFinishing(false);
    }
  };

  // Loading state
  if (loading) {
    return createPortal(
      <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center gap-4">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
        <p className="font-sans text-xs font-bold uppercase tracking-widest text-outline">Loading Module</p>
      </div>,
      document.body
    );
  }

  // Error state
  if (error || !plan) {
    return createPortal(
      <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center gap-4">
        <span className="material-symbols-outlined text-4xl text-error">error</span>
        <p className="font-sans text-sm text-on-surface-variant">{error || 'Failed to load module.'}</p>
        <button
          onClick={onClose}
          className="etched-border bg-primary text-white px-6 py-2.5 font-sans font-bold text-xs uppercase tracking-widest shadow-hard btn-press"
        >
          Close
        </button>
      </div>,
      document.body
    );
  }

  const showQuizResults = plan.isQuizCompleted || quizScore !== null;

  return createPortal(
    <div className="fixed inset-0 z-[100] bg-background overflow-y-auto">
      {/* Sticky breadcrumb header */}
      <header className="sticky top-0 z-10 bg-background border-b border-outline-variant px-8 py-4 flex items-center justify-between">
        <nav className="flex items-center gap-2 font-sans text-[11px] font-bold uppercase tracking-widest text-outline">
          <button onClick={onClose} className="hover:text-primary transition-colors">Workspace</button>
          <span className="material-symbols-outlined text-[11px]">chevron_right</span>
          <span className="text-primary truncate max-w-xs">{plan.title}</span>
        </nav>
        <div className="flex items-center gap-4">
          {plan.isFinished ? (
            <span className="text-[10px] font-bold font-sans text-primary flex items-center gap-1 uppercase tracking-widest">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              Completed — {formatSeconds(localSeconds)}
            </span>
          ) : (
            <span className="text-[10px] font-bold font-sans text-outline flex items-center gap-1 uppercase tracking-widest">
              <span className="material-symbols-outlined text-sm">schedule</span>
              {formatSeconds(localSeconds)}
            </span>
          )}
          <button
            onClick={onClose}
            className="w-9 h-9 etched-border hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </header>

      {/* Content grid */}
      <div className="px-8 py-10 grid grid-cols-12 gap-6 max-w-[1400px] mx-auto">

        {/* COLUMN: Reading area (col-span-8) */}
        <section className="col-span-12 lg:col-span-8 bg-surface-container-lowest etched-border shadow-hard p-10 lg:p-12 relative">
          {/* Module label */}
          <div className="mb-4">
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-outline font-sans">
              Phase {plan.sequenceOrder} — {getDifficultyLabel(plan.difficultyLevel)}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-serif text-headline-lg text-on-surface mb-8 leading-tight">{plan.title}</h1>

          {/* Content */}
          <div className="prose prose-lg max-w-none font-sans text-on-surface
            prose-headings:font-serif prose-headings:text-on-surface
            prose-p:text-on-surface prose-p:leading-relaxed
            prose-strong:text-on-surface
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-l-4 prose-blockquote:border-primary-container
            prose-blockquote:text-outline prose-blockquote:italic prose-blockquote:not-italic
            prose-code:bg-surface-container prose-code:px-1 prose-code:py-0.5
          ">
            <ReactMarkdown>{plan.content || '*No content available for this module yet.*'}</ReactMarkdown>
          </div>

          {/* Footer actions */}
          <div className="mt-16 pt-8 border-t border-outline-variant flex justify-between items-center">
            <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-outline">
              Module {plan.sequenceOrder}
            </span>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="etched-border px-4 py-2 hover:bg-surface-container transition-colors font-sans text-xs font-bold uppercase tracking-widest"
              >
                ← Back
              </button>
              {!plan.isFinished && (
                <button
                  onClick={handleFinishModule}
                  disabled={finishing}
                  className="bg-primary-container text-on-primary-container etched-border py-2 px-6 font-sans font-bold uppercase tracking-widest text-xs shadow-hard btn-press flex items-center gap-2 disabled:opacity-60"
                >
                  {finishing ? (
                    <><span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> Saving...</>
                  ) : (
                    <>Mark Complete <span className="material-symbols-outlined text-sm">check</span></>
                  )}
                </button>
              )}
              {plan.isFinished && (
                <div className="etched-border px-4 py-2 bg-primary text-white font-sans text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">done_all</span>
                  Completed
                </div>
              )}
            </div>
          </div>
        </section>

        {/* COLUMN: Sidebar (col-span-4) */}
        <aside className="col-span-12 lg:col-span-4 space-y-6">

          {/* AI Reading Controls — disabled placeholder */}
          <div className="bg-surface-container-low etched-border p-6 shadow-hard">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-serif text-headline-md">AI Reading Assistant</h3>
              <span className="material-symbols-outlined text-outline">auto_awesome</span>
            </div>
            <div className="space-y-3 opacity-40 pointer-events-none select-none">
              <div className="flex items-center justify-between p-4 bg-primary-container etched-border">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined">record_voice_over</span>
                  <span className="font-sans font-bold text-sm">Audio Narration</span>
                </div>
                <div className="w-10 h-5 bg-outline-variant rounded-full relative shrink-0">
                  <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full" />
                </div>
              </div>
              <div className="flex gap-2">
                {[
                  { icon: 'volume_up', label: 'Natural' },
                  { icon: 'speed', label: '1.0x' },
                  { icon: 'translate', label: 'EN' },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex-1 etched-border p-3 flex flex-col items-center gap-1">
                    <span className="material-symbols-outlined text-[20px]">{icon}</span>
                    <span className="text-[10px] font-bold uppercase font-sans">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[10px] text-outline font-sans mt-3 uppercase tracking-widest">Coming soon</p>
          </div>

          {/* Quiz */}
          {plan.questions && plan.questions.length > 0 && (
            <div className="bg-white etched-border p-6 shadow-hard">
              <h3 className="font-serif text-headline-md mb-1">Active Recall</h3>
              <p className="font-sans text-xs text-outline mb-6">Test your retention of this module.</p>

              {/* Quiz completed banner */}
              {showQuizResults && (
                <div className="mb-6 p-4 etched-border bg-primary-container flex items-center justify-between">
                  <div>
                    <p className="font-sans font-bold text-xs uppercase tracking-widest text-on-primary-container mb-1">
                      Quiz Completed
                    </p>
                    <p className="text-xs text-on-primary-container opacity-80 font-sans">Review your answers below.</p>
                  </div>
                  {quizScore !== null && (
                    <span className="font-serif text-2xl font-bold text-on-primary-container">
                      {quizScore}/{plan.questions.length}
                    </span>
                  )}
                </div>
              )}

              <div className="space-y-8">
                {plan.questions.map((q, index) => (
                  <div key={q.id}>
                    <p className="font-serif text-[18px] leading-snug mb-4">
                      <span className="text-primary">{index + 1}. </span>
                      {q.questionText}
                    </p>
                    <div className="space-y-3">
                      {q.options.map((opt) => {
                        const isSelected = selectedAnswers[q.id] === opt.id;

                        let cls = 'w-full text-left p-4 etched-border flex items-center justify-between gap-3 transition-all font-sans text-sm ';
                        if (showQuizResults) {
                          if (opt.isCorrect) {
                            cls += 'bg-primary-container text-on-primary-container';
                          } else if (isSelected && !opt.isCorrect) {
                            cls += 'bg-error-container text-on-error-container';
                          } else {
                            cls += 'opacity-40 cursor-not-allowed';
                          }
                        } else {
                          if (isSelected) {
                            cls += 'bg-primary text-white';
                          } else {
                            cls += 'cursor-pointer hover:bg-surface-container-low';
                          }
                        }

                        return (
                          <button
                            key={opt.id}
                            onClick={() => handleOptionSelect(q.id, opt.id)}
                            disabled={showQuizResults || submitting}
                            className={cls}
                          >
                            <span>{opt.optionText}</span>
                            {showQuizResults && opt.isCorrect && (
                              <span className="material-symbols-outlined text-sm shrink-0">check_circle</span>
                            )}
                            {showQuizResults && isSelected && !opt.isCorrect && (
                              <span className="material-symbols-outlined text-sm shrink-0 text-error">cancel</span>
                            )}
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
                    disabled={submitting || Object.keys(selectedAnswers).length < (plan.questions?.length || 0)}
                    className="w-full bg-primary-container text-on-primary-container etched-border py-4 font-sans font-bold uppercase tracking-widest text-xs shadow-hard btn-press disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <><span className="material-symbols-outlined animate-spin text-lg">progress_activity</span> Submitting...</>
                    ) : (
                      'Submit Answer →'
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Module info card */}
          <div className="bg-surface-container-highest etched-border p-6">
            <h4 className="font-sans font-bold uppercase tracking-widest text-[10px] text-outline mb-4">Module Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary mt-0.5">schedule</span>
                <div>
                  <p className="font-sans font-bold text-sm text-on-surface">Time Spent</p>
                  <p className="text-xs text-outline font-sans">{formatSeconds(localSeconds)}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary mt-0.5">bar_chart</span>
                <div>
                  <p className="font-sans font-bold text-sm text-on-surface">Difficulty</p>
                  <p className="text-xs text-outline font-sans">{getDifficultyLabel(plan.difficultyLevel)}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary mt-0.5">quiz</span>
                <div>
                  <p className="font-sans font-bold text-sm text-on-surface">Quiz</p>
                  <p className="text-xs text-outline font-sans">
                    {plan.isQuizCompleted
                      ? `Completed${quizScore !== null ? ` — ${quizScore}/${plan.questions?.length}` : ''}`
                      : plan.questions?.length
                        ? `${plan.questions.length} question${plan.questions.length !== 1 ? 's' : ''}`
                        : 'None'}
                  </p>
                </div>
              </li>
              {plan.isFinished && (
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary mt-0.5">check_circle</span>
                  <div>
                    <p className="font-sans font-bold text-sm text-on-surface">Status</p>
                    <p className="text-xs text-outline font-sans">Completed</p>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </aside>
      </div>
    </div>,
    document.body
  );
}
