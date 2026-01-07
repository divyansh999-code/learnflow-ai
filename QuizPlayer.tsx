import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, CheckCircle, XCircle, Clock, Zap, RotateCw, Layers, BrainCircuit } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Quiz, QuizResult, Flashcard } from '../types';
import { useStore } from '../store';
import { clsx } from 'clsx';

// Flashcard Component
const FlashcardViewer = ({ flashcards }: { flashcards: Flashcard[] }) => {
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0);

  const handleNext = () => {
    if (index < flashcards.length - 1) {
      setIsFlipped(false);
      setDirection(1);
      setTimeout(() => setIndex(index + 1), 150);
    }
  };

  const handlePrev = () => {
    if (index > 0) {
      setIsFlipped(false);
      setDirection(-1);
      setTimeout(() => setIndex(index - 1), 150);
    }
  };

  const currentCard = flashcards[index];

  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-2xl mx-auto py-8">
      <div className="mb-6 flex items-center justify-between w-full px-4">
        <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">
          Card {index + 1} / {flashcards.length}
        </span>
        <div className="text-xs text-gray-400 flex items-center gap-1">
          <RotateCw size={12} /> Click to flip
        </div>
      </div>

      <div className="relative w-full aspect-[16/10] perspective-1000 cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
        <motion.div
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
          className="w-full h-full relative preserve-3d"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden bg-white dark:bg-dark-800 rounded-3xl shadow-xl border-2 border-primary-100 dark:border-dark-600 flex flex-col items-center justify-center p-8 text-center">
            <div className="absolute top-4 left-4 text-xs font-bold text-primary-500 uppercase">Term</div>
            <h3 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white">
              {currentCard.front}
            </h3>
            <div className="absolute bottom-4 text-gray-400 text-xs">Tap to reveal</div>
          </div>

          {/* Back */}
          <div 
            className="absolute inset-0 backface-hidden bg-gradient-to-br from-primary-600 to-secondary-600 rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 text-center"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <div className="absolute top-4 left-4 text-xs font-bold text-white/70 uppercase">Definition</div>
            <p className="text-lg md:text-xl font-medium text-white leading-relaxed">
              {currentCard.back}
            </p>
          </div>
        </motion.div>
      </div>

      <div className="flex items-center gap-6 mt-10">
        <Button 
          variant="secondary" 
          onClick={handlePrev} 
          disabled={index === 0}
          className="rounded-full w-14 h-14 p-0 flex items-center justify-center"
        >
          <ChevronLeft size={24} />
        </Button>
        
        <div className="h-1.5 w-32 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary-500"
            animate={{ width: `${((index + 1) / flashcards.length) * 100}%` }}
          />
        </div>

        <Button 
          variant="secondary"
          onClick={handleNext} 
          disabled={index === flashcards.length - 1}
          className="rounded-full w-14 h-14 p-0 flex items-center justify-center"
        >
          <ChevronRight size={24} />
        </Button>
      </div>

      <style>{`
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
      `}</style>
    </div>
  );
};

export const QuizPlayer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addResult } = useStore();
  
  const quiz = location.state?.quiz as Quiz;
  const initialMode = location.state?.mode as 'quiz' | 'flashcards' | undefined;

  if (!quiz) {
    return <Navigate to="/create" />;
  }

  const [mode, setMode] = useState<'quiz' | 'flashcards'>(initialMode || 'quiz');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [answers, setAnswers] = useState<{ questionId: string; selectedIndex: number }[]>([]);
  const [startTime] = useState(Date.now());
  const [showExplanation, setShowExplanation] = useState(false);
  const [direction, setDirection] = useState(1);
  const [answerStreak, setAnswerStreak] = useState(0);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / quiz.questions.length) * 100;
  
  // Timer calculations
  const [timeElapsed, setTimeElapsed] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);
  
  const isLowTime = timeElapsed > 180; 

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    
    setIsAnswered(true);
    setShowExplanation(true);
    
    const isCorrect = selectedOption === currentQuestion.correctAnswerIndex;
    if (isCorrect) {
      setAnswerStreak(prev => prev + 1);
    } else {
      setAnswerStreak(0);
    }

    // Save answer
    const newAnswers = [...answers, { questionId: currentQuestion.id, selectedIndex: selectedOption }];
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setDirection(1);
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setShowExplanation(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const correctCount = answers.reduce((acc, ans, idx) => {
      const q = quiz.questions.find(q => q.id === ans.questionId) || quiz.questions[idx];
      return acc + (ans.selectedIndex === q.correctAnswerIndex ? 1 : 0);
    }, 0);

    const result: QuizResult = {
      quizId: quiz.id,
      quizTitle: quiz.title,
      score: Math.round((correctCount / quiz.questions.length) * 100),
      totalQuestions: quiz.questions.length,
      correctCount,
      timeSpentSeconds: Math.round((Date.now() - startTime) / 1000),
      completedAt: Date.now(),
      answers
    };

    addResult(result);
    navigate('/results', { state: { result } });
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -50 : 50,
      opacity: 0
    })
  };

  return (
    <div className="max-w-3xl mx-auto min-h-[calc(100vh-100px)] flex flex-col relative pb-8">
      
      {/* Mode Switcher */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-100 dark:bg-dark-800 p-1 rounded-xl flex gap-1 border border-gray-200 dark:border-dark-700">
           <button
             onClick={() => setMode('quiz')}
             className={clsx(
               "px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all",
               mode === 'quiz' ? "bg-white dark:bg-dark-700 text-primary-600 shadow-sm" : "text-gray-500 hover:text-gray-900 dark:text-gray-400"
             )}
           >
             <BrainCircuit size={16} /> Quiz
           </button>
           <button
             onClick={() => setMode('flashcards')}
             className={clsx(
               "px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all",
               mode === 'flashcards' ? "bg-white dark:bg-dark-700 text-secondary-600 shadow-sm" : "text-gray-500 hover:text-gray-900 dark:text-gray-400"
             )}
           >
             <Layers size={16} /> Flashcards
           </button>
        </div>
      </div>

      {mode === 'flashcards' ? (
        <AnimatePresence mode="wait">
          <motion.div
            key="flashcards"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1"
          >
            {quiz.flashcards && quiz.flashcards.length > 0 ? (
               <FlashcardViewer flashcards={quiz.flashcards} />
            ) : (
               <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
                 <motion.div 
                   initial={{ rotate: -10, scale: 0.9 }}
                   animate={{ rotate: 0, scale: 1 }}
                   transition={{ type: "spring", stiffness: 200, damping: 15 }}
                   className="w-24 h-32 bg-gray-50 dark:bg-dark-800/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-dark-600 flex items-center justify-center mb-6"
                 >
                    <Layers className="w-8 h-8 text-gray-300 dark:text-dark-500" />
                 </motion.div>
                 <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Flashcards Generated</h3>
                 <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-8">
                   This quiz was created without flashcards. Try creating a new quiz to generate a fresh deck.
                 </p>
                 <Button variant="secondary" onClick={() => setMode('quiz')}>
                    <BrainCircuit className="w-4 h-4 mr-2" />
                    Return to Quiz
                 </Button>
               </div>
            )}
          </motion.div>
        </AnimatePresence>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div 
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col flex-1"
          >
            {/* Streak Counter */}
            <AnimatePresence>
              {answerStreak > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute top-0 right-0 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg z-10"
                >
                  <Zap size={14} className="fill-white" />
                  {answerStreak} Streak!
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 truncate max-w-[70%]">{quiz.title}</h2>
                <div className={clsx(
                  "flex items-center gap-2 text-sm font-mono px-3 py-1 rounded-full shadow-sm border transition-colors duration-500",
                  isLowTime 
                    ? "bg-red-50 dark:bg-red-900/30 border-red-200 text-red-600 animate-pulse" 
                    : "bg-white dark:bg-dark-800 border-gray-100 dark:border-dark-700 text-gray-500"
                )}>
                  <Clock size={16} />
                  <span>{timeElapsed}s</span>
                </div>
              </div>
              
              {/* Smooth Progress Bar */}
              <div className="h-3 w-full bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden p-[2px]">
                <motion.div 
                  className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(progress, 5)}%` }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                   <div className="absolute top-0 right-0 bottom-0 w-2 bg-white/30 rounded-full blur-[1px]" />
                </motion.div>
              </div>
              
              {/* Animated Question Counter */}
              <div className="text-right mt-2 h-6 overflow-hidden relative">
                 <AnimatePresence mode="popLayout" initial={false}>
                   <motion.div
                     key={currentQuestionIndex}
                     initial={{ y: 20, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     exit={{ y: -20, opacity: 0 }}
                     transition={{ duration: 0.3 }}
                     className="text-sm text-gray-500 font-medium absolute right-0"
                   >
                     Question {currentQuestionIndex + 1} of {quiz.questions.length}
                   </motion.div>
                 </AnimatePresence>
              </div>
            </div>

            {/* Question Card */}
            <div className="flex-1 flex flex-col justify-center relative">
              <AnimatePresence mode='wait' custom={direction}>
                <motion.div
                  key={currentQuestion.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/20 dark:border-dark-700 perspective-1000"
                >
                  <h3 className="text-2xl font-display font-bold mb-8 text-gray-900 dark:text-white leading-relaxed">
                    {currentQuestion.text}
                  </h3>

                  <div className="space-y-3">
                    {currentQuestion.options.map((option, idx) => {
                      const isSelected = selectedOption === idx;
                      const isCorrect = idx === currentQuestion.correctAnswerIndex;
                      
                      let buttonStyle = "border-gray-200 dark:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-700";
                      
                      if (isAnswered) {
                        if (isCorrect) buttonStyle = "border-green-50 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400";
                        else if (isSelected) buttonStyle = "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400";
                        else buttonStyle = "opacity-50 grayscale";
                      } else if (isSelected) {
                        buttonStyle = "border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-dark-800";
                      }

                      return (
                        <motion.button
                          key={idx}
                          animate={isSelected ? { scale: 1.02 } : { scale: 1 }}
                          whileHover={!isAnswered ? { scale: 1.01, x: 4 } : {}}
                          whileTap={!isAnswered ? { scale: 0.98 } : {}}
                          onClick={() => handleOptionSelect(idx)}
                          disabled={isAnswered}
                          className={clsx(
                            "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 text-lg flex items-center justify-between group relative overflow-hidden",
                            buttonStyle
                          )}
                        >
                          <span className="relative z-10">{option}</span>
                          
                          {/* Checkmark Swipe Effect */}
                          {isAnswered && isSelected && (
                            <motion.div 
                              initial={{ x: '-100%', opacity: 0 }}
                              animate={{ x: '0%', opacity: 1 }}
                              transition={{ duration: 0.4, ease: "easeOut" }}
                              className={clsx("absolute inset-0 z-0 opacity-10", isCorrect ? "bg-green-500" : "bg-red-500")} 
                            />
                          )}

                          {isAnswered && isCorrect && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 200, damping: 10 }}
                              className="relative z-10"
                            >
                              <CheckCircle className="text-green-500 w-6 h-6" />
                            </motion.div>
                          )}
                          {isAnswered && isSelected && !isCorrect && (
                             <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="relative z-10"
                             >
                               <XCircle className="text-red-500 w-6 h-6" />
                             </motion.div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Explanation Reveal */}
                  <AnimatePresence>
                    {isAnswered && showExplanation && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0, y: -10 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -10 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="overflow-hidden mt-6"
                      >
                        <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
                          <div className="flex gap-3">
                            <div className="mt-1">
                              <div className="bg-blue-100 dark:bg-blue-800 p-1 rounded-full">
                                <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                              </div>
                            </div>
                            <div>
                              <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-1">Explanation</h4>
                              <motion.p 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }} 
                                transition={{ delay: 0.2 }}
                                className="text-blue-700 dark:text-blue-200 text-sm leading-relaxed"
                              >
                                {currentQuestion.explanation}
                              </motion.p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer Controls */}
            <div className="py-6 flex justify-end">
              {!isAnswered ? (
                <Button 
                  size="lg" 
                  onClick={handleSubmitAnswer}
                  disabled={selectedOption === null}
                  className="shadow-xl"
                >
                  Submit Answer
                </Button>
              ) : (
                <Button size="lg" onClick={handleNext} className="shadow-xl">
                  {currentQuestionIndex === quiz.questions.length - 1 ? "Finish Quiz" : "Next Question"}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};