import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/store';
import { Check, Clock, Calendar as CalendarIcon, Zap } from 'lucide-react';
import { clsx } from 'clsx';
import confetti from 'canvas-confetti';

// Helper to get dates for the calendar view (current month + padding)
const getCalendarWeeks = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  
  // Start from the first day of the month
  const firstDayOfMonth = new Date(year, month, 1);
  
  // Calculate start date (Monday start)
  // getDay(): Sun=0, Mon=1...Sat=6. We want Mon=0...Sun=6
  const dayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; 
  const startDate = new Date(year, month, 1 - dayOfWeek);
  
  const weeks = [];
  let current = new Date(startDate);
  
  // Generate 5 weeks to ensure we cover the month
  for (let w = 0; w < 5; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      week.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
  }
  
  return weeks;
};

interface DayStats {
  date: Date;
  count: number;
  totalTime: number;
  isToday: boolean;
  isCurrentMonth: boolean;
}

interface DayTileProps { 
  day: DayStats; 
  onHover: (e: React.MouseEvent, day: DayStats) => void; 
  onLeave: () => void;
}

const DayTile: React.FC<DayTileProps> = ({ 
  day, 
  onHover, 
  onLeave 
}) => {
  const intensity = Math.min(4, day.count);
  
  // Intensity Colors
  const bgColors = [
    'bg-gray-100 dark:bg-dark-700',      // 0
    'bg-emerald-200 dark:bg-emerald-900/40', // 1
    'bg-emerald-300 dark:bg-emerald-800/60', // 2
    'bg-emerald-400 dark:bg-emerald-600/80', // 3
    'bg-emerald-500 dark:bg-emerald-500'     // 4+
  ];

  const borderColors = [
    'border-gray-200 dark:border-dark-600',
    'border-emerald-300 dark:border-emerald-800',
    'border-emerald-400 dark:border-emerald-700',
    'border-emerald-500 dark:border-emerald-600',
    'border-emerald-600 dark:border-emerald-400'
  ];

  return (
    <motion.div
      variants={{
        hidden: { scale: 0.8, opacity: 0 },
        visible: { scale: 1, opacity: 1 }
      }}
      whileHover={{ scale: 1.15, zIndex: 10 }}
      onMouseEnter={(e) => onHover(e, day)}
      onMouseLeave={onLeave}
      className={clsx(
        "relative w-full aspect-square rounded-lg border transition-colors duration-300 ease-in-out cursor-pointer",
        bgColors[intensity],
        borderColors[intensity],
        !day.isCurrentMonth && "opacity-30 grayscale",
        day.isToday && "ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-dark-800 animate-pulse-slow-border"
      )}
    >
      {day.count > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="absolute -top-1 -right-1 w-3 h-3 bg-white dark:bg-dark-800 rounded-full flex items-center justify-center shadow-sm"
        >
          <Check size={8} className="text-emerald-500" strokeWidth={4} />
        </motion.div>
      )}
      <style>{`
        @keyframes pulse-slow-border {
          0%, 100% { box-shadow: 0 0 0 0px rgba(99, 102, 241, 0.4); }
          50% { box-shadow: 0 0 0 4px rgba(99, 102, 241, 0); }
        }
        .animate-pulse-slow-border {
          animation: pulse-slow-border 2s infinite;
        }
      `}</style>
    </motion.div>
  );
};

interface WeekRowProps { 
  week: Date[]; 
  weekIndex: number; 
  history: any[]; 
  onHoverDay: (e: React.MouseEvent, day: DayStats) => void; 
  onLeaveDay: () => void; 
}

const WeekRow: React.FC<WeekRowProps> = ({ 
  week, 
  weekIndex, 
  history, 
  onHoverDay, 
  onLeaveDay 
}) => {
  const today = new Date();
  
  // Process days
  const processedDays = week.map(date => {
    const dateStr = date.toLocaleDateString();
    const dayHistory = history.filter(h => new Date(h.completedAt).toLocaleDateString() === dateStr);
    
    return {
      date,
      count: dayHistory.length,
      totalTime: dayHistory.reduce((acc: number, curr: any) => acc + curr.timeSpentSeconds, 0),
      isToday: date.toDateString() === today.toDateString(),
      isCurrentMonth: date.getMonth() === today.getMonth()
    };
  });

  const isWeekComplete = processedDays.every(d => d.count > 0);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isWeekComplete && rowRef.current) {
      // Trigger confetti for each day with delay
      const rect = rowRef.current.getBoundingClientRect();
      const widthPerDay = rect.width / 7;
      
      // Calculate centers for each day
      processedDays.forEach((_, i) => {
        setTimeout(() => {
          const x = (rect.left + (i * widthPerDay) + (widthPerDay/2)) / window.innerWidth;
          const y = (rect.top + (rect.height/2)) / window.innerHeight;
          
          confetti({
            particleCount: 10,
            spread: 30,
            origin: { x, y },
            colors: ['#fbbf24', '#f59e0b', '#d97706'],
            disableForReducedMotion: true,
            zIndex: 100
          });
        }, 1000 + (i * 50)); // Staggered start after initial render
      });
    }
  }, [isWeekComplete]);

  return (
    <motion.div
      ref={rowRef}
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: { 
          opacity: 1, 
          x: 0,
          transition: { staggerChildren: 0.05, delayChildren: 0.1 }
        }
      }}
      className="relative grid grid-cols-7 gap-3 mb-3 p-2 rounded-xl"
    >
      {/* Week Completion Gold Border */}
      {isWeekComplete && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-20">
           <motion.rect
             width="100%"
             height="100%"
             x="0"
             y="0"
             rx="12"
             ry="12"
             fill="none"
             stroke="#fbbf24"
             strokeWidth="3"
             initial={{ pathLength: 0, opacity: 0 }}
             animate={{ pathLength: 1, opacity: 1 }}
             transition={{ duration: 1.5, ease: "easeInOut", delay: 1.2 }} // Wait for tiles
           />
           {/* Swooping Checkmark */}
           <motion.path
             d="M 20 50 L 40 70 L 100 20" // Abstract check shape, rendered roughly over the row
             // Real implementation would likely need distinct overlay component, 
             // utilizing a simpler overlay checkmark here centered on row
             stroke="none"
             fill="none"
           />
        </svg>
      )}

      {/* Week Completion Checkmark Overlay */}
      <AnimatePresence>
        {isWeekComplete && (
            <motion.div 
               initial={{ x: '-10%', opacity: 0, scale: 0.5 }}
               animate={{ x: '100%', opacity: [0, 1, 1, 0], scale: 1.2 }}
               transition={{ duration: 1, ease: "easeInOut", delay: 1.5 }}
               className="absolute top-0 bottom-0 left-0 flex items-center pointer-events-none z-30"
               style={{ width: '50%' }}
            >
               <div className="bg-yellow-400/20 backdrop-blur-sm p-2 rounded-full border-2 border-yellow-400 shadow-lg shadow-yellow-500/50">
                  <Check className="w-8 h-8 text-yellow-600 dark:text-yellow-300 stroke-[4]" />
               </div>
            </motion.div>
        )}
      </AnimatePresence>
      
      {/* Flash Effect Overlay */}
      {isWeekComplete && (
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: [0, 0.5, 0] }}
           transition={{ duration: 0.5, delay: 1 }}
           className="absolute inset-0 bg-yellow-400 rounded-xl z-10 pointer-events-none mix-blend-overlay"
        />
      )}

      {processedDays.map((day, dIdx) => (
        <DayTile 
          key={dIdx} 
          day={day} 
          onHover={onHoverDay} 
          onLeave={onLeaveDay} 
        />
      ))}
    </motion.div>
  );
};

export const CalendarHeatmap = () => {
  const { history } = useStore();
  const weeks = getCalendarWeeks();
  const [tooltip, setTooltip] = useState<{ x: number; y: number; data: DayStats } | null>(null);

  const handleHoverDay = (e: React.MouseEvent, day: DayStats) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      x: rect.left + rect.width / 2,
      y: rect.top,
      data: day
    });
  };

  const handleLeaveDay = () => {
    setTooltip(null);
  };

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="w-full">
       <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
               <CalendarIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
             </div>
             <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Study Consistency</h3>
                <p className="text-xs text-gray-500">Daily quiz activity this month</p>
             </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-400">
             <span>Less</span>
             <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map(i => (
                  <div key={i} className={clsx(
                    "w-3 h-3 rounded-sm",
                    i===0 ? 'bg-gray-100 dark:bg-dark-700' : 
                    i===1 ? 'bg-emerald-200 dark:bg-emerald-900/40' :
                    i===2 ? 'bg-emerald-300 dark:bg-emerald-800/60' :
                    i===3 ? 'bg-emerald-400 dark:bg-emerald-600/80' :
                    'bg-emerald-500 dark:bg-emerald-500'
                  )} />
                ))}
             </div>
             <span>More</span>
          </div>
       </div>

       <div className="bg-white dark:bg-dark-800 rounded-3xl p-6 border border-gray-100 dark:border-dark-700 shadow-sm">
          {/* Days Header */}
          <div className="grid grid-cols-7 gap-3 mb-2 px-2">
             {daysOfWeek.map(d => (
               <div key={d} className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                 {d}
               </div>
             ))}
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
          >
             {weeks.map((week, idx) => (
                <WeekRow 
                  key={idx} 
                  week={week} 
                  weekIndex={idx} 
                  history={history}
                  onHoverDay={handleHoverDay}
                  onLeaveDay={handleLeaveDay}
                />
             ))}
          </motion.div>
       </div>

       {/* Tooltip */}
       <AnimatePresence>
         {tooltip && (
            <motion.div
               initial={{ opacity: 0, y: 10, scale: 0.9 }}
               animate={{ opacity: 1, y: -10, scale: 1 }}
               exit={{ opacity: 0, scale: 0.9 }}
               style={{ 
                 position: 'fixed', 
                 left: tooltip.x, 
                 top: tooltip.y,
                 transform: 'translate(-50%, -100%)',
                 zIndex: 50
               }}
               className="pointer-events-none"
            >
               <div className="bg-gray-900 text-white text-xs p-3 rounded-xl shadow-xl flex flex-col gap-1 min-w-[140px]">
                  <div className="font-bold border-b border-gray-700 pb-1 mb-1">
                    {tooltip.data.date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Quizzes:</span>
                    <span className="font-bold text-emerald-400">{tooltip.data.count}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Study Time:</span>
                    <span className="font-bold">{Math.floor(tooltip.data.totalTime / 60)}m</span>
                  </div>
                  {tooltip.data.count === 0 && (
                     <div className="text-gray-500 italic mt-1">No activity</div>
                  )}
                  
                  {/* Tooltip Arrow */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
               </div>
            </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
};
