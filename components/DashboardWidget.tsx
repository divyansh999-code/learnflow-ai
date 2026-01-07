import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Minus, Plus, Box, ArrowRight, Maximize2, Minimize2 } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from './components/Button';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Link } from 'react-router-dom';

interface DashboardWidgetProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  className?: string;
  onRefresh?: () => Promise<void> | void;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  emptyActionLink?: string;
  
  // Focus Mode Props
  id?: string;
  isFocused?: boolean;
  onToggleFocus?: (id: string) => void;
}

export const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  title,
  icon: Icon,
  children,
  className,
  onRefresh,
  isEmpty = false,
  emptyTitle = "No data yet",
  emptyDescription = "Get started to see insights here.",
  emptyActionLabel = "Get Started",
  emptyActionLink = "/create",
  id,
  isFocused = false,
  onToggleFocus
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    // Simulate generic refresh delay if no promise returned, or await promise
    if (onRefresh) {
        await Promise.resolve(onRefresh());
    }
    // Force at least 800ms animation for feel
    setTimeout(() => {
        setIsRefreshing(false);
    }, 800);
  };

  const handleFocus = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFocus && id) {
      onToggleFocus(id);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: isFocused ? 1 : 1, // handled by layout transition
        zIndex: isFocused ? 50 : 1 // handled by class, but explicit here for clarity
      }}
      transition={{ 
        layout: { duration: 0.4, type: "spring", stiffness: 300, damping: 25 } 
      }}
      className={clsx(
        "bg-white/70 dark:bg-dark-800/70 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-dark-700 shadow-lg overflow-hidden flex flex-col relative transition-shadow duration-300",
        isFocused 
          ? "fixed inset-4 md:inset-10 z-50 h-auto m-auto shadow-2xl dark:shadow-black/50 border-primary-500/50" 
          : "h-full",
        className
      )}
      style={{ 
        height: isFocused ? 'auto' : isMinimized ? 'auto' : '100%',
        maxHeight: isFocused ? '90vh' : 'none'
      }}
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between p-6 shrink-0 relative z-20 cursor-default" 
        onClick={(e) => {
           if (!isFocused) setIsMinimized(!isMinimized);
        }}
      >
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl transition-colors group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20">
            <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <div>
             <h2 className="text-xl font-bold text-gray-900 dark:text-white select-none">{title}</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
           {/* Focus Toggle */}
           {onToggleFocus && !isMinimized && (
             <button
               onClick={handleFocus}
               className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all"
               title={isFocused ? "Exit Focus Mode" : "Focus Mode"}
             >
               {isFocused ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
             </button>
           )}

           {onRefresh && !isMinimized && !isFocused && (
             <button 
               onClick={handleRefresh}
               className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all"
               title="Refresh"
             >
               <motion.div animate={{ rotate: isRefreshing ? 360 : 0 }} transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: "linear" }}>
                 <RefreshCw size={18} />
               </motion.div>
             </button>
           )}
           
           {!isFocused && (
             <button 
               onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
               className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
             >
               <motion.div
                  initial={false}
                  animate={{ rotate: isMinimized ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
               >
                  <Minus size={18} />
               </motion.div>
             </button>
           )}
        </div>
      </div>

      {/* Content Area */}
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
                height: 'auto', 
                opacity: 1,
                transition: { 
                    height: { duration: 0.3, ease: "easeOut" },
                    opacity: { duration: 0.2, delay: 0.1 }
                }
            }}
            exit={{ 
                height: 0, 
                opacity: 0,
                transition: { 
                    height: { duration: 0.3, ease: "easeInOut" },
                    opacity: { duration: 0.1 }
                }
            }}
            className="flex-1 relative flex flex-col min-h-0"
          >
             {/* Refresh Overlay */}
             <AnimatePresence>
               {isRefreshing && (
                 <motion.div
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   className="absolute inset-0 bg-white/50 dark:bg-dark-900/50 backdrop-blur-[4px] z-10 flex items-center justify-center rounded-b-3xl"
                 >
                    <LoadingSpinner size={40} className="text-primary-500" />
                 </motion.div>
               )}
             </AnimatePresence>

             {/* Content or Empty State */}
             <div className="p-8 pt-0 flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar">
               {isEmpty ? (
                 <div className="flex-1 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden rounded-2xl border-2 border-dashed border-gray-100 dark:border-dark-700 bg-gray-50/50 dark:bg-dark-800/50">
                    {/* Pulsing Dots Background */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                    
                    {/* Floating Icon */}
                    <motion.div
                       animate={{ y: [-10, 10, -10] }}
                       transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                       className="mb-6 bg-white dark:bg-dark-700 p-4 rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none"
                    >
                       <Box className="w-12 h-12 text-indigo-400" strokeWidth={1.5} />
                    </motion.div>

                    {/* Letter by letter text */}
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex">
                       {emptyTitle.split('').map((char, i) => (
                         <motion.span
                           key={i}
                           initial={{ opacity: 0, y: 5 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ delay: i * 0.05 }}
                         >
                           {char}
                         </motion.span>
                       ))}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-xs text-center">
                        {emptyDescription}
                    </p>

                    {/* Slide up button */}
                    <motion.div
                       initial={{ y: 50, opacity: 0 }}
                       animate={{ y: 0, opacity: 1 }}
                       transition={{ delay: 0.5, type: "spring", bounce: 0.5 }}
                    >
                       <Link to={emptyActionLink}>
                         <Button>
                           {emptyActionLabel} <ArrowRight size={16} className="ml-2" />
                         </Button>
                       </Link>
                    </motion.div>
                 </div>
               ) : (
                 <motion.div
                    animate={{ 
                        opacity: isRefreshing ? 0.5 : 1, 
                        scale: isRefreshing ? 0.98 : 1,
                        filter: isRefreshing ? 'blur(2px)' : 'blur(0px)'
                    }}
                    transition={{ duration: 0.3 }}
                    className="h-full flex flex-col"
                 >
                    {children}
                 </motion.div>
               )}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
