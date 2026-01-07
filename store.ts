import { create } from 'zustand';
import { Quiz, QuizResult, UserStats, Badge, Goal, ThemeColor, DashboardLayout } from './types';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  title: string;
}

interface AppState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;

  dashboardLayout: DashboardLayout;
  toggleDashboardLayout: () => void;
  
  reduceMotion: boolean;
  toggleReduceMotion: () => void;
  
  // Auth
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  handleSession: (session: Session | null) => Promise<void>;
  login: (user: UserProfile) => void;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<UserProfile>) => void;
  
  // Data
  history: QuizResult[];
  savedQuizzes: Quiz[];
  goals: Goal[];
  badges: Badge[];
  userStats: UserStats;
  
  // Data Actions
  fetchUserData: () => Promise<void>;
  addResult: (result: QuizResult) => Promise<void>;
  removeResult: (completedAt: number) => Promise<void>;
  saveQuiz: (quiz: Quiz) => Promise<void>;
  addGoal: (goal: Goal) => Promise<void>;
  removeGoal: (goalId: string) => Promise<void>;
  updateGoalProgress: (goalId: string, increment: number) => Promise<void>;
  unlockBadge: (badgeId: string) => void;
}

const INITIAL_BADGES: Badge[] = [
  { id: 'b-1', name: 'Early Bird', description: 'Complete a quiz before 8 AM', iconName: 'sun', isLocked: true, currentProgress: 0, maxProgress: 1 },
  { id: 'b-2', name: 'Quiz Master', description: 'Score 100% on 3 quizzes', iconName: 'crown', isLocked: true, currentProgress: 0, maxProgress: 3 },
  { id: 'b-3', name: 'Streak Fire', description: 'Reach a 7-day study streak', iconName: 'flame', isLocked: true, currentProgress: 0, maxProgress: 7 },
  { id: 'b-4', name: 'Knowledge Seeker', description: 'Create 5 custom quizzes', iconName: 'brain', isLocked: true, currentProgress: 0, maxProgress: 5 },
  { id: 'b-5', name: 'Speedster', description: 'Finish a quiz in under 60 seconds', iconName: 'zap', isLocked: true, currentProgress: 0, maxProgress: 1 },
  { id: 'b-6', name: 'Perfectionist', description: 'Answer 50 questions correctly', iconName: 'target', isLocked: true, currentProgress: 0, maxProgress: 50 },
  { id: 'b-7', name: 'Explorer', description: 'Try quizzes in 3 different topics', iconName: 'rocket', isLocked: true, currentProgress: 0, maxProgress: 3 },
  { id: 'b-8', name: 'Scholar', description: 'Study for 10 hours total', iconName: 'trophy', isLocked: true, currentProgress: 0, maxProgress: 10 }
];

export const useStore = create<AppState>((set, get) => ({
  theme: 'light',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

  themeColor: 'indigo',
  setThemeColor: (color) => set({ themeColor: color }),

  dashboardLayout: 'grid',
  toggleDashboardLayout: () => set((state) => ({ dashboardLayout: state.dashboardLayout === 'grid' ? 'list' : 'grid' })),

  reduceMotion: false,
  toggleReduceMotion: () => set((state) => ({ reduceMotion: !state.reduceMotion })),

  user: null,
  isAuthenticated: false,
  isLoading: true,

  history: [],
  savedQuizzes: [],
  goals: [],
  badges: INITIAL_BADGES,
  userStats: {
    totalQuizzes: 0,
    averageScore: 0,
    studyStreak: 0,
    totalQuestionsAnswered: 0,
    xp: 0,
    level: 1,
  },

  handleSession: async (session) => {
    if (session?.user) {
      try {
        // Fetch profile
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error);
        }

        set({ 
          isAuthenticated: true, 
          user: { 
            id: session.user.id,
            name: profile?.name || session.user.user_metadata.name || 'Student',
            email: session.user.email || '',
            title: profile?.title || 'Student'
          },
          isLoading: false
        });
        
        // Fetch data immediately after user is set
        get().fetchUserData();
      } catch (e) {
        console.error("Session handling error:", e);
        set({ isAuthenticated: true, isLoading: false }); 
      }
    } else {
      set({ isAuthenticated: false, user: null, isLoading: false, history: [], savedQuizzes: [], goals: [] });
    }
  },

  login: (user) => set({ isAuthenticated: true, user }),
  
  logout: async () => {
    await supabase.auth.signOut();
    set({ 
      isAuthenticated: false, 
      user: null, 
      history: [], 
      savedQuizzes: [], 
      goals: [] 
    });
  },

  updateUser: async (updates) => {
    const user = get().user;
    if (!user) return;
    
    // Optimistic update
    set({ user: { ...user, ...updates } });
    
    // DB Update
    const { error } = await supabase.from('profiles').update({
      name: updates.name,
      title: updates.title
    }).eq('id', user.id);

    if (error) console.error('Error updating profile:', error);
  },

  fetchUserData: async () => {
    const user = get().user;
    if (!user) return;

    try {
      // 1. Fetch Quizzes
      const { data: quizzes } = await supabase
        .from('quizzes')
        .select('*')
        .order('created_at', { ascending: false });

      // 2. Fetch Results
      const { data: results } = await supabase
        .from('results')
        .select('*')
        .order('completed_at', { ascending: false });

      // 3. Fetch Goals
      const { data: goals } = await supabase
        .from('goals')
        .select('*');

      // 4. Calculate Stats
      const historyData = (results || []).map(r => ({
        ...r,
        completedAt: new Date(r.completed_at).getTime(),
        quizId: r.quiz_id,
        quizTitle: r.quiz_title,
        timeSpentSeconds: r.time_spent,
        totalQuestions: r.total_questions,
        correctCount: r.correct_count
      }));

      const quizzesData = (quizzes || []).map(q => ({
        ...q,
        createdAt: new Date(q.created_at).getTime(),
        // Handle JSONB data
        questions: typeof q.questions === 'string' ? JSON.parse(q.questions) : q.questions,
        flashcards: typeof q.flashcards === 'string' ? JSON.parse(q.flashcards) : q.flashcards
      }));
      
      // Calculate Stats
      const totalQuizzes = historyData.length;
      const currentTotalScore = historyData.reduce((acc: number, curr: any) => acc + curr.score, 0);
      const averageScore = totalQuizzes > 0 ? Math.round(currentTotalScore / totalQuizzes) : 0;
      const totalQuestions = historyData.reduce((acc: number, curr: any) => acc + (curr.totalQuestions || 0), 0);
      const xp = totalQuestions * 10 + currentTotalScore; // Simple XP formula
      const level = Math.floor(xp / 1000) + 1;

      // Calculate Streak (Simple logic)
      const streak = totalQuizzes > 0 ? 1 : 0; 

      set({
        history: historyData,
        savedQuizzes: quizzesData,
        goals: goals || [],
        userStats: {
          totalQuizzes,
          averageScore,
          totalQuestionsAnswered: totalQuestions,
          xp,
          level,
          studyStreak: streak
        }
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  },

  addResult: async (result) => {
    const user = get().user;
    if (!user) return;

    // Optimistic UI
    set((state) => {
       const newHistory = [result, ...state.history];
       // Update local stats
       const totalQuizzes = newHistory.length;
       const currentTotalScore = newHistory.reduce((acc, curr) => acc + curr.score, 0);
       const averageScore = totalQuizzes > 0 ? Math.round(currentTotalScore / totalQuizzes) : 0;
       const totalQuestions = newHistory.reduce((acc, curr) => acc + (curr.totalQuestions || 0), 0);
       const xp = totalQuestions * 10 + currentTotalScore;
       const level = Math.floor(xp / 1000) + 1;
       
       return { 
           history: newHistory,
           userStats: {
               ...state.userStats,
               totalQuizzes,
               averageScore,
               totalQuestionsAnswered: totalQuestions,
               xp,
               level
           }
       };
    });

    // DB Insert
    await supabase.from('results').insert({
      user_id: user.id,
      quiz_id: result.quizId,
      quiz_title: result.quizTitle,
      score: result.score,
      total_questions: result.totalQuestions,
      correct_count: result.correctCount,
      time_spent: result.timeSpentSeconds,
      completed_at: new Date(result.completedAt).toISOString()
    });
    
    get().fetchUserData(); // Re-sync stats
  },

  removeResult: async (completedAt) => {
    // Optimistic
    set((state) => ({
      history: state.history.filter((h) => h.completedAt !== completedAt)
    }));

    // DB Delete logic would go here if implemented
  },

  saveQuiz: async (quiz) => {
    const user = get().user;
    if (!user) return;

    set((state) => ({ savedQuizzes: [quiz, ...state.savedQuizzes] }));

    await supabase.from('quizzes').insert({
      user_id: user.id,
      title: quiz.title,
      topic: quiz.topic,
      questions: quiz.questions,
      flashcards: quiz.flashcards,
      created_at: new Date(quiz.createdAt).toISOString()
    });
    
    get().fetchUserData();
  },

  addGoal: async (goal) => {
    const user = get().user;
    if (!user) return;

    set((state) => ({ goals: [...state.goals, goal] }));

    await supabase.from('goals').insert({
      id: goal.id,
      user_id: user.id,
      title: goal.title,
      description: goal.description,
      target: goal.target,
      current: goal.current,
      unit: goal.unit,
      category: goal.category,
      color_theme: goal.colorTheme
    });
  },

  removeGoal: async (goalId) => {
    set((state) => ({ goals: state.goals.filter(g => g.id !== goalId) }));
    await supabase.from('goals').delete().eq('id', goalId);
  },

  updateGoalProgress: async (goalId, increment) => {
    const goals = get().goals;
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const newCurrent = Math.min(goal.target, goal.current + increment);

    set((state) => ({
      goals: state.goals.map(g => g.id === goalId 
        ? { ...g, current: newCurrent } 
        : g)
    }));

    await supabase.from('goals').update({ current: newCurrent }).eq('id', goalId);
  },

  unlockBadge: (badgeId) => set((state) => ({
    badges: state.badges.map(b => b.id === badgeId ? { ...b, isLocked: false, unlockedAt: Date.now() } : b)
  })),
}));