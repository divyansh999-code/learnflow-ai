import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Type, Sliders, Sparkles, AlertCircle, Upload, X, FileCheck, Brain } from 'lucide-react';
import { Button } from '../components/Button';
import { useStore } from '../store/store';
import { generateQuizFromText } from '../lib/gemini';
import { Difficulty } from '../types';
import * as pdfjsLib from 'pdfjs-dist';
import { clsx } from 'clsx';

// Handle esm.sh module export structure safely
// We wrap this in a try-catch block during execution, or handle imports carefully
let pdfjs: any = pdfjsLib;
if (pdfjsLib && (pdfjsLib as any).default) {
    pdfjs = (pdfjsLib as any).default;
}

// Safely initialize worker
try {
  if (pdfjs && pdfjs.GlobalWorkerOptions) {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
  }
} catch (e) {
  console.warn("PDF.js worker initialization failed. PDF upload might not work.", e);
}

// Loading messages for the AI generation phase
const LOADING_MSGS = [
  "Reading your document...",
  "Analyzing key concepts...",
  "Identifying important terms...",
  "Drafting questions...",
  "Polishing options...",
  "Finalizing your quiz..."
];

export const CreateQuiz = () => {
  const navigate = useNavigate();
  const { saveQuiz } = useStore();
  
  const [text, setText] = useState('');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Medium);
  const [questionCount, setQuestionCount] = useState(5);
  const [flashcardCount, setFlashcardCount] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState('');
  
  const [fileInfo, setFileInfo] = useState<{ name: string; size: string; pages: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cycle through loading messages
  useEffect(() => {
    let interval: any;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingMsgIndex((prev) => (prev + 1) % LOADING_MSGS.length);
      }, 2000);
    } else {
      setLoadingMsgIndex(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size too large. Max 10MB.');
      return;
    }

    if (!pdfjs) {
        setError('PDF Library failed to load. Please try pasting text instead.');
        return;
    }

    setError('');
    setIsExtracting(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';
      }

      setText(fullText);
      setFileInfo({
        name: file.name,
        size: formatFileSize(file.size),
        pages: pdf.numPages
      });
      
      // Auto-suggest topic if empty
      if (!topic) {
        setTopic(file.name.replace('.pdf', ''));
      }

    } catch (err) {
      console.error(err);
      setError('Failed to extract text from PDF. Please try a different file.');
    } finally {
      setIsExtracting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const clearFile = () => {
    setFileInfo(null);
    setText('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGenerate = async () => {
    if (!topic) {
      setError('Please enter a topic.');
      return;
    }
    
    setError('');
    setIsLoading(true);

    try {
      const quiz = await generateQuizFromText(text, topic, difficulty, questionCount, flashcardCount);
      saveQuiz(quiz);
      navigate('/play', { state: { quiz } });
    } catch (err: any) {
      // Improved error handling to show specific messages from gemini.ts
      console.error("UI Caught Error:", err);
      setError(err.message || 'Failed to generate quiz. Please check your API key.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">Create New Quiz</h1>
        <p className="text-gray-600 dark:text-gray-400">Configure your settings and let AI do the magic.</p>
      </div>

      <div className="grid gap-6">
        {/* Input Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-dark-800 p-6 rounded-2xl border border-gray-100 dark:border-dark-700 shadow-sm relative overflow-hidden"
        >
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-lg">
              <Type className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-lg font-bold">Quiz Content</h2>
          </div>

          <div className="space-y-6 relative z-10">
            <div>
              <label className="block text-sm font-medium mb-1">Topic / Subject *</label>
              <input 
                type="text" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Photosynthesis, World War II, Calculus..."
                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-dark-600 bg-white dark:bg-dark-700 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              />
            </div>

            <div>
               <label className="block text-sm font-medium mb-2">Source Material</label>
               
               {/* PDF Upload Zone with Transition */}
               <div className="relative min-h-[140px]">
                 <AnimatePresence mode="wait">
                   {!fileInfo ? (
                     <motion.div 
                      key="upload"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => !isExtracting && fileInputRef.current?.click()}
                      className={`border-2 border-dashed border-gray-300 dark:border-dark-600 rounded-xl p-8 text-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all group ${isExtracting ? 'opacity-50 cursor-not-allowed' : ''}`}
                     >
                       <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="application/pdf"
                        onChange={handleFileUpload}
                        disabled={isExtracting}
                       />
                       <div className="bg-primary-100 dark:bg-dark-700 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                         {isExtracting ? (
                            <div className="animate-spin h-6 w-6 border-2 border-primary-600 border-t-transparent rounded-full"/>
                         ) : (
                            <Upload className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                         )}
                       </div>
                       <p className="font-medium text-gray-700 dark:text-gray-300">
                          {isExtracting ? 'Extracting text...' : 'Click to upload PDF'}
                       </p>
                       <p className="text-sm text-gray-500 mt-1">or drag and drop (Max 10MB)</p>
                     </motion.div>
                   ) : (
                     <motion.div 
                       key="file-info"
                       initial={{ opacity: 0, scale: 0.95 }}
                       animate={{ opacity: 1, scale: 1 }}
                       exit={{ opacity: 0, scale: 0.95 }}
                       transition={{ duration: 0.2 }}
                       className="bg-primary-5 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 rounded-xl p-4 flex items-center justify-between group"
                     >
                        <div className="flex items-center gap-3">
                          <div className="bg-white dark:bg-dark-800 p-2 rounded-lg shadow-sm group-hover:rotate-3 transition-transform">
                            <FileCheck className="w-6 h-6 text-primary-600" />
                          </div>
                          <div>
                            <div className="font-medium text-primary-900 dark:text-primary-100 truncate max-w-[200px] sm:max-w-md">
                              {fileInfo.name}
                            </div>
                            <div className="text-xs text-primary-700 dark:text-primary-300 flex items-center gap-2">
                              <span>{fileInfo.size}</span>
                              <span>•</span>
                              <span>{fileInfo.pages} pages</span>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={clearFile}
                          className="p-2 hover:bg-white/50 dark:hover:bg-black/20 rounded-lg transition-colors text-primary-700 dark:text-primary-300"
                        >
                          <X size={20} />
                        </button>
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                 <label className="block text-sm font-medium">Extracted Text (Editable)</label>
                 {text && (
                   <span className="text-xs text-gray-400">{text.length} chars</span>
                 )}
              </div>
              <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Or paste your text directly here..."
                className="w-full px-4 py-3 h-32 rounded-xl border border-gray-200 dark:border-dark-600 bg-white dark:bg-dark-700 focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none"
              />
            </div>
          </div>
        </motion.div>

        {/* Settings Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-dark-800 p-6 rounded-2xl border border-gray-100 dark:border-dark-700 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-secondary-100 dark:bg-secondary-900/30 p-2 rounded-lg">
              <Sliders className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
            </div>
            <h2 className="text-lg font-bold">Configuration</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Difficulty</label>
              <div className="flex bg-gray-100 dark:bg-dark-700 p-1 rounded-xl relative">
                {[Difficulty.Easy, Difficulty.Medium, Difficulty.Hard].map((level) => {
                   const isSelected = difficulty === level;
                   const colorMap = {
                     [Difficulty.Easy]: 'text-green-600 dark:text-green-400',
                     [Difficulty.Medium]: 'text-orange-600 dark:text-orange-400',
                     [Difficulty.Hard]: 'text-red-600 dark:text-red-400'
                   };
                   
                   return (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={clsx(
                        "flex-1 py-2 text-sm font-medium rounded-lg transition-all relative z-10",
                        isSelected ? colorMap[level] : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                      )}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="difficulty-selector"
                          className="absolute inset-0 bg-white dark:bg-dark-600 shadow-sm rounded-lg -z-10"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      {level}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Number of Questions: {questionCount}</label>
              <input 
                type="range" 
                min="3" 
                max="15" 
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-dark-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>3</span>
                <span>15</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Number of Flashcards: {flashcardCount}</label>
              <input 
                type="range" 
                min="3" 
                max="15" 
                value={flashcardCount}
                onChange={(e) => setFlashcardCount(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-dark-700 rounded-lg appearance-none cursor-pointer accent-secondary-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>3</span>
                <span>15</span>
              </div>
            </div>
          </div>
        </motion.div>

        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl"
          >
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-sm">{error}</p>
          </motion.div>
        )}

        <Button 
          size="lg" 
          onClick={handleGenerate} 
          isLoading={isLoading}
          disabled={isExtracting}
          className="w-full h-16 text-lg bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 overflow-hidden relative"
        >
          <AnimatePresence mode='wait'>
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="flex items-center gap-3"
              >
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <motion.span 
                  key={loadingMsgIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="font-medium min-w-[180px] text-left"
                >
                  {LOADING_MSGS[loadingMsgIndex]}
                </motion.span>
              </motion.div>
            ) : (
              <motion.div
                key="static"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                <span>Generate Quiz</span>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </div>
    </div>
  );
};
