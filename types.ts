export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number; // 0-3
  explanation: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export interface Quiz {
  id: string;
  title: string;
  topic: string;
  questions: Question[];
  flashcards: Flashcard[];
  createdAt: number;
}

export interface QuizResult {
  quizId: string;
  quizTitle: string;
  score: number; // percentage
  totalQuestions: number;
  correctCount: number;
  timeSpentSeconds: number;
  completedAt: number;
  answers: { questionId: string; selectedIndex: number }[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: 'trophy' | 'flame' | 'target' | 'zap' | 'brain' | 'star' | 'rocket' | 'crown' | 'sun';
  isLocked: boolean;
  currentProgress: number;
  maxProgress: number;
  unlockedAt?: number;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  current: number;
  target: number;
  unit: string;
  category: 'quiz' | 'streak' | 'score' | 'time';
  colorTheme: 'blue' | 'purple' | 'orange' | 'green';
  deadline?: number;
}

export interface UserStats {
  totalQuizzes: number;
  averageScore: number;
  studyStreak: number;
  totalQuestionsAnswered: number;
  xp: number;
  level: number;
}

export enum Difficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
}

export enum QuestionType {
  MultipleChoice = 'Multiple Choice',
  TrueFalse = 'True/False',
}

export type ThemeColor = 'indigo' | 'blue' | 'purple' | 'rose' | 'orange' | 'teal';
export type DashboardLayout = 'grid' | 'list';