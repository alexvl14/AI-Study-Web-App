export interface Notebook {
  id: number;
  title: string;
  description: string;
  lastOpenedDateTime: string;
}

export interface CreateNotebookRequest {
  title: string;
  description: string;
}

export enum Sender {
  User = 0,
  AI = 1
}

export enum Difficulty {
  Easy = 0,
  Medium = 1,
  Hard = 2
}

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
  files: FileResponse[];
  studyPlans: StudyPlanResponse[];
  recentChat: ChatHistoryResponse[];
}

