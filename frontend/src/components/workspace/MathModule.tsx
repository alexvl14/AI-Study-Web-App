import { useState } from 'react';
import MarkdownView from '../MarkdownView';
import api from '../../services/api';
import type { MathExerciseResponse, ExerciseSubmissionResponse, VerifyExerciseResponse } from '../../types/notebook';

interface MathModuleProps {
  notebookId: string;
  planId: number;
  exercises: MathExerciseResponse[];
}

const MAX_PHOTOS = 3;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function MathModule({ notebookId, planId, exercises }: MathModuleProps) {
  return (
    <div className="mt-12 pt-10 border-t border-outline-variant">
      <div className="mb-8">
        <span className="font-sans font-bold text-xs uppercase tracking-widest text-primary">Practice</span>
        <h2 className="font-serif text-headline-lg text-on-surface mt-2">Exercises</h2>
        <p className="font-sans text-body-md text-on-surface-variant mt-1">
          Work each problem by hand, then upload up to {MAX_PHOTOS} photos of your solution for step-by-step feedback.
        </p>
      </div>

      <div className="space-y-8">
        {exercises.map((exercise, index) => (
          <ExerciseCard
            key={exercise.id}
            notebookId={notebookId}
            planId={planId}
            exercise={exercise}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

interface ExerciseCardProps {
  notebookId: string;
  planId: number;
  exercise: MathExerciseResponse;
  index: number;
}

function ExerciseCard({ notebookId, planId, exercise, index }: ExerciseCardProps) {
  // Prior submissions from the GET payload + any added this session (oldest-first).
  const [submissions, setSubmissions] = useState<ExerciseSubmissionResponse[]>(exercise.submissions || []);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasCorrect = submissions.some((s) => s.isCorrect);

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;

    const invalid = selected.find((f) => !ACCEPTED_TYPES.includes(f.type));
    if (invalid) {
      setError('Only JPG, PNG, or WEBP images are allowed.');
      return;
    }
    if (selected.length > MAX_PHOTOS) {
      setError(`Please select at most ${MAX_PHOTOS} photos.`);
      return;
    }

    previews.forEach((url) => URL.revokeObjectURL(url));
    setFiles(selected);
    setPreviews(selected.map((f) => URL.createObjectURL(f)));
  };

  const clearSelection = () => {
    previews.forEach((url) => URL.revokeObjectURL(url));
    setFiles([]);
    setPreviews([]);
  };

  const handleSubmit = async () => {
    if (files.length === 0 || submitting) return;
    try {
      setSubmitting(true);
      setError(null);
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));

      const response = await api.post<VerifyExerciseResponse>(
        `/notebooks/${notebookId}/study-plans/${planId}/math/${exercise.id}/verify`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      const { isCorrect, feedback } = response.data;
      setSubmissions((prev) => [...prev, { isCorrect, feedback }]);
      clearSelection();
    } catch (err: any) {
      console.error('Failed to verify exercise:', err);
      setError(err.response?.data?.message || err.response?.data || 'Failed to grade your submission. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white etched-border shadow-hard p-6 lg:p-8">
      {/* Prompt */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <span className="font-serif text-2xl text-primary leading-none shrink-0">{index + 1}.</span>
          <div className="prose max-w-none font-sans text-on-surface prose-p:my-0 prose-p:leading-relaxed prose-strong:text-on-surface prose-code:bg-surface-container prose-code:px-1 prose-code:py-0.5">
            <MarkdownView>{exercise.prompt}</MarkdownView>
          </div>
        </div>
        {hasCorrect && (
          <span className="shrink-0 flex items-center gap-1 bg-primary-container text-on-primary-container etched-border shadow-hard-sm px-2.5 py-1 font-sans font-bold text-[10px] uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            Solved
          </span>
        )}
      </div>

      {/* Hint */}
      {exercise.hint && (
        <div className="mb-5">
          <button
            onClick={() => setShowHint((v) => !v)}
            className="flex items-center gap-1.5 font-sans font-bold text-[11px] uppercase tracking-widest text-outline hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-sm">{showHint ? 'lightbulb' : 'lightbulb_outline'}</span>
            {showHint ? 'Hide hint' : 'Show hint'}
          </button>
          {showHint && (
            <div className="mt-3 p-4 bg-surface-container-low border border-dashed border-on-surface font-sans text-sm text-on-surface-variant">
              <MarkdownView>{exercise.hint}</MarkdownView>
            </div>
          )}
        </div>
      )}

      {/* Submission history */}
      {submissions.length > 0 && (
        <div className="space-y-3 mb-5">
          {submissions.map((sub, i) => (
            <div
              key={i}
              className={`p-4 etched-border ${sub.isCorrect ? 'bg-primary-container' : 'bg-error-container'}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`material-symbols-outlined text-base ${sub.isCorrect ? 'text-on-primary-container' : 'text-on-error-container'}`}
                >
                  {sub.isCorrect ? 'check_circle' : 'cancel'}
                </span>
                <span
                  className={`font-sans font-bold text-[10px] uppercase tracking-widest ${sub.isCorrect ? 'text-on-primary-container' : 'text-on-error-container'}`}
                >
                  Attempt {i + 1} — {sub.isCorrect ? 'Correct' : 'Needs work'}
                </span>
              </div>
              <div
                className={`prose prose-sm max-w-none font-sans prose-p:my-1 ${
                  sub.isCorrect ? 'text-on-primary-container prose-strong:text-on-primary-container' : 'text-on-error-container prose-strong:text-on-error-container'
                }`}
              >
                <MarkdownView>{sub.feedback}</MarkdownView>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Photo previews */}
      {previews.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-4">
          {previews.map((url, i) => (
            <div key={i} className="w-24 h-24 etched-border overflow-hidden bg-surface-container-low">
              <img src={url} alt={`Solution preview ${i + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
          <button
            onClick={clearSelection}
            className="w-24 h-24 etched-border flex flex-col items-center justify-center gap-1 text-outline hover:text-error hover:bg-error-container transition-colors"
          >
            <span className="material-symbols-outlined">delete</span>
            <span className="font-sans text-[10px] font-bold uppercase tracking-widest">Clear</span>
          </button>
        </div>
      )}

      {error && (
        <p className="font-sans text-sm text-error mb-3">{error}</p>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <label className="cursor-pointer bg-transparent text-on-surface px-5 py-3 etched-border shadow-hard btn-press font-sans font-bold text-xs uppercase tracking-widest flex items-center gap-2">
          <span className="material-symbols-outlined text-base">photo_camera</span>
          {files.length > 0 ? 'Change photos' : 'Upload photos'}
          <input
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            multiple
            className="hidden"
            onChange={handleFilesSelected}
            disabled={submitting}
          />
        </label>

        <button
          onClick={handleSubmit}
          disabled={files.length === 0 || submitting}
          className="bg-primary-container text-on-primary-container px-6 py-3 etched-border shadow-hard btn-press font-sans font-bold text-xs uppercase tracking-widest flex items-center gap-2 disabled:opacity-50"
        >
          {submitting ? (
            <><span className="material-symbols-outlined animate-spin text-base">progress_activity</span> Grading...</>
          ) : (
            <>{submissions.length > 0 ? 'Submit again' : 'Submit for feedback'} <span className="material-symbols-outlined text-base">arrow_forward</span></>
          )}
        </button>

        {files.length > 0 && (
          <span className="font-sans text-xs text-outline">{files.length} photo{files.length !== 1 ? 's' : ''} selected</span>
        )}
      </div>
    </div>
  );
}
