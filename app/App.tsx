import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { MotionConfig, AnimatePresence } from 'framer-motion';
import { Layout } from '../components/Layout';
import { Landing } from '../pages/Landing';
import { Dashboard } from '../pages/Dashboard';
import { CreateQuiz } from '../pages/CreateQuiz';
import { QuizPlayer } from '../pages/QuizPlayer';
import { Results } from '../pages/Results';
import { History } from '../pages/History';
import { Settings } from '../pages/Settings';
import { Goals } from '../pages/Goals';
import { Login } from '../pages/Login';
import { Flashcards } from '../pages/Flashcards';
import { useStore } from '../store/store';
import { PageTransition } from '../components/PageTransition';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { supabase } from '../services/supabase';

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useStore();
  
  if (isLoading) {
    return <div className="h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-dark-900"><LoadingSpinner size={40} className="text-primary-600" /></div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const { handleSession } = useStore();
  
  // Initialize Auth Listener
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        handleSession(data.session);
      } catch (error) {
        console.error("Auth initialization failed:", error);
        handleSession(null);
      }
    };
    
    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => subscription.unsubscribe();
  }, [handleSession]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
           <PageTransition><Landing /></PageTransition>
        } />
        <Route path="/login" element={
           <PageTransition><Login /></PageTransition>
        } />
        
        {/* Protected Routes Wrapper */}
        <Route element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
          <Route path="/create" element={<PageTransition><CreateQuiz /></PageTransition>} />
          <Route path="/play" element={<PageTransition><QuizPlayer /></PageTransition>} />
          <Route path="/flashcards" element={<PageTransition><Flashcards /></PageTransition>} />
          <Route path="/results" element={<PageTransition><Results /></PageTransition>} />
          <Route path="/history" element={<PageTransition><History /></PageTransition>} />
          <Route path="/goals" element={<PageTransition><Goals /></PageTransition>} />
          <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const { reduceMotion } = useStore();

  useEffect(() => {
    if (reduceMotion) {
      document.body.classList.add('reduce-motion');
    } else {
      document.body.classList.remove('reduce-motion');
    }
  }, [reduceMotion]);

  return (
    <MotionConfig reducedMotion={reduceMotion ? "always" : "user"}>
      <HashRouter>
        <AnimatedRoutes />
      </HashRouter>
    </MotionConfig>
  );
}

export default App;
