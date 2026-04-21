import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  questions?: Question[];
}

export interface AppSettings {
  appName: string;
  logoUrl: string;
}

interface AppState {
  user: User | null;
  settings: AppSettings;
  lessons: Lesson[];
  progress: Record<string, number>;

  setUser: (user: User | null) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  setLessons: (lessons: Lesson[]) => void;
  updateLessonQuestions: (lessonId: string, questions: Question[]) => void;
  setProgress: (lessonId: string, score: number) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()((set) => ({
  user: null,
  settings: { appName: 'Meu Treinamento', logoUrl: '' },
  lessons: [],
  progress: {},

  setUser: (user) => set({ user }),
  updateSettings: (settings) =>
    set((state) => ({ settings: { ...state.settings, ...settings } })),
  setLessons: (lessons) => set({ lessons }),
  updateLessonQuestions: (lessonId, questions) =>
    set((state) => ({
      lessons: state.lessons.map((l) =>
        l.id === lessonId ? { ...l, questions } : l
      ),
    })),
  setProgress: (lessonId, score) =>
    set((state) => ({
      progress: { ...state.progress, [lessonId]: score },
    })),
  logout: () => set({ user: null }),
}));