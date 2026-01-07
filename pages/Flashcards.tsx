import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/store';
import { Layers, RotateCw, Play, BookOpen, Plus, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Quiz } from '../types';
import { clsx } from 'clsx';

// Deck Card Component
const DeckCard: React.FC<{ quiz: Quiz; index: number }> = ({ quiz, index }) => {
  const cardCount = quiz.flashcards?.length || 0;
  
  // Stagger animation based on index
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative"
    >
      {/* Stack Effect Backgrounds */}
      <div className="absolute top-2 left-2 right-2 bottom-0 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-2xl shadow-sm z-0 transform translate-y-2 scale-[0.95] group-hover:translate-y-3 group-hover:rotate-1 transition-all duration-300" />
      <div className="absolute top-1 left-1 right-1 bottom-0 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-2xl shadow-sm z-0 transform translate-y-1 scale-[0.98] group-hover:translate-y-1.5 group-hover:-rotate-1 transition-all duration-300" />
      
      {/* Main Card */}
      <div className="relative z-10 bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-100 dark:border-dark-700 shadow-md group-hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between group-hover:-translate-y-1">
        <div>
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-secondary-50 dark:bg-secondary-900/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
               <Layers className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
             </div>
             <div className="bg-gray-100 dark:bg-dark-700 px-3 py-1 rounded-full text-xs font-bold text-gray-500">
                {cardCount} Cards
             </div>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-tight">
            {quiz.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
             {quiz.topic}
          </p>
        </div>

        <Link to="/play" state={{ quiz, mode: 'flashcards' }} className="block w-full">
           <Button variant="secondary" className="w-full">
              <RotateCw className="w-4 h-4 mr-2" /> Study Deck
           </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export const Flashcards = () => {
  const { savedQuizzes } = useStore();
  
  // Filter quizzes that actually have flashcards (though logic should ensure they do)
  const decks = savedQuizzes.filter(q => q.flashcards && q.flashcards.length > 0);

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
           <div className="p-3.5 bg-secondary-100 dark:bg-secondary-900/30 rounded-2xl shadow-sm">
             <Layers className="w-8 h-8 text-secondary-600 dark:text-secondary-400" />
           </div>
           <div>
             <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Flashcard Decks</h1>
             <p className="text-gray-500 dark:text-gray-400">Master key concepts with spaced repetition</p>
           </div>
        </div>
        
        <Link to="/create">
           <Button variant="outline" className="border-secondary-200 text-secondary-700 hover:bg-secondary-50 dark:border-secondary-800 dark:text-secondary-300 dark:hover:bg-secondary-900/20">
              <Plus className="w-4 h-4 mr-2" /> New Deck
           </Button>
        </Link>
      </div>

      {decks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
           <AnimatePresence>
              {decks.map((quiz, index) => (
                 <DeckCard key={quiz.id} quiz={quiz} index={index} />
              ))}
           </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4 min-h-[50vh]">
           <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ duration: 0.5 }}
             className="relative w-72 h-72 mb-8 flex items-center justify-center"
           >
              {/* Central Circle Glow */}
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 bg-secondary-500/10 dark:bg-secondary-500/20 rounded-full blur-3xl pointer-events-none"
              />
              
              {/* Back Card */}
              <motion.div 
                 animate={{ rotate: -12, y: -15, x: -10 }}
                 transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                 className="absolute w-40 h-56 bg-white dark:bg-dark-700 rounded-2xl border-2 border-dashed border-gray-200 dark:border-dark-600 shadow-sm"
              />
              
              {/* Middle Card */}
              <motion.div 
                 animate={{ rotate: 12, y: -5, x: 10 }}
                 transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.5 }}
                 className="absolute w-40 h-56 bg-white dark:bg-dark-700 rounded-2xl border-2 border-dashed border-gray-200 dark:border-dark-600 shadow-md"
              />
              
              {/* Front Card */}
              <motion.div 
                 animate={{ y: [0, -20, 0] }}
                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                 className="relative z-10 w-40 h-56 bg-white dark:bg-dark-800 rounded-2xl border border-gray-100 dark:border-dark-600 shadow-2xl flex flex-col items-center justify-center"
              >
                 <div className="p-4 bg-secondary-50 dark:bg-secondary-900/30 rounded-full mb-4">
                    <Layers className="w-8 h-8 text-secondary-500" />
                 </div>
                 <div className="h-2 w-20 bg-gray-100 dark:bg-dark-600 rounded-full mb-2" />
                 <div className="h-2 w-12 bg-gray-100 dark:bg-dark-600 rounded-full" />

                 {/* Sparkle Decoration */}
                 <motion.div 
                    animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], rotate: 45 }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    className="absolute -top-3 -right-3 text-yellow-400"
                 >
                    <Sparkles size={24} fill="currentColor" />
                 </motion.div>
              </motion.div>

              {/* Floating Mini Cards */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.5],
                    x: Math.cos(i * 2) * 80,
                    y: Math.sin(i * 2) * 80 - 40,
                    rotate: Math.random() * 360
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    delay: i * 1.5,
                    ease: "easeOut"
                  }}
                >
                   <div className="w-10 h-12 bg-white dark:bg-dark-700 rounded-lg border border-gray-100 dark:border-dark-600 shadow-sm flex items-center justify-center">
                      <div className="w-4 h-0.5 bg-gray-200 dark:bg-dark-500 rounded-full" />
                   </div>
                </motion.div>
              ))}
           </motion.div>
           
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 text-center">Your Flashcard Library is Empty</h2>
           <p className="text-gray-500 dark:text-gray-400 max-w-md text-center mb-8 text-lg leading-relaxed">
             Create a quiz from your study materials to automatically generate a personalized flashcard deck.
           </p>
           
           <Link to="/create">
             <Button size="lg" className="shadow-xl shadow-secondary-500/20 bg-gradient-to-r from-secondary-500 to-pink-600 hover:from-secondary-600 hover:to-pink-700 border-none">
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Deck
             </Button>
           </Link>
        </div>
      )}
    </div>
  );
};
