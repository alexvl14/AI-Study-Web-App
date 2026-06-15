export const NotebookType = {
  General: 0,
  Math: 1
} as const;

export type NotebookType = (typeof NotebookType)[keyof typeof NotebookType];

export interface Notebook {
  id: number;
  title: string;
  description: string;
  type: NotebookType;
  lastOpenedDateTime: string;
}

export interface CreateNotebookRequest {
  title: string;
  description: string;
  type: NotebookType;
}

export const Sender = {
  User: 0,
  AI: 1
} as const;

export type Sender = (typeof Sender)[keyof typeof Sender];

export const Difficulty = {
  Easy: 0,
  Medium: 1,
  Hard: 2
} as const;

export type Difficulty = (typeof Difficulty)[keyof typeof Difficulty];

export interface FileResponse {
  id: number;
  fileName: string;
  contentType: string;
}

export interface QuizOptionResponse {
  id: number;
  optionText: string;
  isCorrect: boolean;
  isSelectedByUser: boolean;
}

export interface QuizQuestionResponse {
  id: number;
  questionText: string;
  options: QuizOptionResponse[];
}

export interface ExerciseSubmissionResponse {
  isCorrect: boolean;
  feedback: string;
}

export interface MathExerciseResponse {
  id: string;
  prompt: string;
  hint: string;
  submissions: ExerciseSubmissionResponse[];
}

// Result of POST .../math/:exerciseId/verify
export interface VerifyExerciseResponse {
  id: number;
  exerciseId: string;
  isCorrect: boolean;
  feedback: string;
  createdAt: string;
}

export interface StudyPlanResponse {
  id: number;
  sequenceOrder: number;
  title: string;
  description: string;
  difficultyLevel: Difficulty;
  isGenerated: number; // 0 or 1
  content?: string;
  isQuizCompleted?: boolean;
  isFinished?: boolean;
  timeItTookToFinish?: string;
  questions?: QuizQuestionResponse[];
  exercises?: MathExerciseResponse[]; // Math notebooks only; General leaves this empty
}

export interface ChatHistoryResponse {
  id: number;
  message: string;
  senderRole: Sender;
  sendDateTime: string;
}

export interface NotebookDetails {
  id: number;
  title: string;
  description: string;
  type: NotebookType;
  files: FileResponse[];
  studyPlans: StudyPlanResponse[];
  recentChat: ChatHistoryResponse[];
}

