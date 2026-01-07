import React, { useEffect, useState } from 'react';
import { motion, Variants, AnimatePresence, useMotionValue, Reorder } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useStore } from '../store';
import { Button } from '../components/ui/Button';
import { CircularProgress } from '../components/ui/CircularProgress';
import { Skeleton } from '../components/ui/Skeleton';
import { CountUp } from '../components/ui/CountUp';
import { FlipNumber } from '../components/ui/FlipNumber';
import { Trophy, Flame, Target, ArrowUpRight, ArrowDownRight, Clock, BookOpen, Plus, Sparkles, Brain, Calendar, BarChart3, CheckCircle, AlertCircle, Trash2, ChevronRight as ChevronRightIcon, List, Play, Box, LayoutGrid, LayoutList, Sun, Moon, Sunset, CloudSun, Layers } from 'lucide-react';
import { clsx } from 'clsx';
import { Quiz, QuizResult } from '../types';
import confetti from 'canvas-confetti';
import { Achievements } from '../components/Achievements';
import { GoalsSection } from '../components/GoalsSection';
import { DashboardWidget } from '../components/ui/DashboardWidget';

// ----------------------------------------------------------------------
// SUB-COMPONENTS
// ----------------------------------------------------------------------

const TimeBasedGreeting = ({ name }: { name: string }) => {
  const [greeting, setGreeting] = useState('');
  const [Icon, setIcon] = useState(Sun);
  
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        setGreeting('Good Morning');
        setIcon(Sun);
      } else if (hour >= 12 && hour < 17) {
        setGreeting('Good Afternoon');
        setIcon(CloudSun);
      } else if (hour >= 17 && hour < 21) {
        setGreeting('Good Evening');
        setIcon(Sunset);
      } else {
        setGreeting('Good Night');
        setIcon(Moon);
      }
    };
    
    updateGreeting();
    const timer = setInterval(updateGreeting, 60000); // Check every minute
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <h1 className="text-3xl md:text-5xl font-display font-bold text-gray-900 dark:text-white relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={greeting}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <span>{greeting}, {name}</span>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Icon className="w-8 h-8 md:w-10 md:h-10 text-orange-500 dark:text-yellow-400" />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </h1>
      </div>
    </div>
  );
};

// 3D Flip Card Component for Saved Quizzes
const QuizFlipCard: React.FC<{ quiz: Quiz; index: number }> = ({ quiz, index }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group h-56 w-full perspective-1000"
    >
      <div className="relative w-full h-full transition-all duration-700 preserve-3d group-hover:rotate-y-180">
        {/* Front */}
        <div className="absolute inset-0 backface-hidden bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-100 dark:border-dark-700 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="bg-primary-50 dark:bg-primary-900/20 p-3 rounded-xl">
              <Brain className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <span className="text-xs font-bold px-2 py-1 rounded-full bg-gray-100 dark:bg-dark-700 text-gray-500">
              {quiz.questions.length} Qs
            </span>
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2 leading-tight">
              {quiz.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{quiz.topic}</p>
          </div>
          {/* Quick Flashcards Action (Visible on front for quick access if preferred, but here we keep it clean) */}
          <div className="flex items-center gap-2 mt-2">
            <div className="text-xs text-gray-400 flex items-center gap-1">
               <Layers size={12} /> {quiz.flashcards?.length || 0} Cards
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-6 text-white shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 opacity-90">
              <Calendar size={14} />
              <span className="text-xs">{new Date(quiz.createdAt).toLocaleDateString()}</span>
            </div>
            <h3 className="font-bold text-lg line-clamp-2">{quiz.title}</h3>
          </div>
          
          <div className="space-y-2">
             <Link to="/play" state={{ quiz }} className="w-full block">
               <Button 
                   variant="ghost" 
                   magnetic
                   className="w-full py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2 text-white"
               >
                 <motion.div
                   whileHover={{ y: [0, -3, 0] }}
                   transition={{ duration: 0.5, repeat: Infinity }}
                 >
                   <Play className="w-4 h-4 fill-white" />
                 </motion.div>
                 Start Quiz
               </Button>
             </Link>
             <Link to="/play" state={{ quiz, mode: 'flashcards' }} className="w-full block">
               <Button 
                   variant="ghost" 
                   className="w-full py-2 bg-black/20 hover:bg-black/30 backdrop-blur-sm rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2 text-white"
               >
                 <Layers className="w-4 h-4" />
                 Flashcards
               </Button>
             </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// List View Item for Saved Quizzes
const QuizListItem: React.FC<{ quiz: Quiz; index: number }> = ({ quiz, index }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-dark-800 rounded-2xl p-4 border border-gray-100 dark:border-dark-700 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow group"
    >
      <div className="flex items-center gap-4">
        <div className="bg-primary-50 dark:bg-primary-900/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
          <Brain className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white text-base">{quiz.title}</h3>
          <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
            <span>{quiz.topic}</span>
            <span>•</span>
            <span>{quiz.questions.length} Questions</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Layers size={10} /> {quiz.flashcards?.length || 0} Cards</span>
            <span>•</span>
            <span>{new Date(quiz.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Link to="/play" state={{ quiz, mode: 'flashcards' }}>
          <Button size="sm" variant="ghost" className="text-gray-500 hover:text-primary-600">
             <Layers size={16} />
          </Button>
        </Link>
        <Link to="/play" state={{ quiz }}>
          <Button size="sm" variant="ghost">
            Start <ChevronRightIcon size={16} className="ml-1" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

// Trend Indicator
const TrendIndicator = ({ trend, show }: { trend: number, show: boolean }) => {
  const isPositive = trend >= 0;
  const text = `${Math.abs(trend)}%`;
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    if (show) {
      let i = 0;
      const timer = setInterval(() => {
        if (i < text.length) {
          setDisplayText(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(timer);
        }
      }, 100);
      return () => clearInterval(timer);
    }
  }, [show, text]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={show ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4 }}
      className={clsx(
        "flex items-center text-xs font-bold px-2.5 py-1 rounded-full border backdrop-blur-sm mt-2 w-fit",
        isPositive 
          ? "text-emerald-500 bg-emerald-50/80 dark:bg-emerald-900/30 border-emerald-100 dark:border-emerald-800/50" 
          : "text-red-500 bg-red-50/80 dark:bg-red-900/30 border-red-100 dark:border-red-800/50"
      )}
    >
      {isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
      {displayText}
    </motion.div>
  );
};

const StreakHeatmap = ({ history }: { history: any[] }) => {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  return (
    <div className="flex gap-1.5 mt-4">
      {days.map((date, i) => {
        const dateStr = date.toLocaleDateString();
        const isActive = history.some((h: any) => new Date(h.completedAt).toLocaleDateString() === dateStr);
        const isToday = i === 6;

        return (
          <div key={i} className="relative group/day">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8 + (i * 0.05), type: "spring" }}
              className={clsx(
                "w-6 h-6 rounded-md border transition-all duration-300",
                isActive 
                  ? "bg-orange-500 border-orange-600 shadow-sm" 
                  : "bg-gray-100 dark:bg-dark-700 border-gray-200 dark:border-dark-600",
                isToday && !isActive && "border-orange-400 border-dashed animate-pulse",
                isToday && isActive && "ring-2 ring-orange-200 dark:ring-orange-900 ring-offset-1 dark:ring-offset-dark-800"
              )}
            >
              {isActive && (
                <motion.div 
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-full h-full bg-white/20 rounded-md"
                />
              )}
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};

const StatCard = ({ 
  icon: Icon, 
  label, 
  value, 
  type = 'standard',
  colorClass, 
  hoverGradient,
  borderClass,
  delayIndex,
  trend,
  duration,
  history,
}: any) => {
  const [showTrend, setShowTrend] = useState(false);
  
  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-3xl p-6 h-full shadow-md transition-all duration-300 group bg-white dark:bg-dark-800 cursor-grab active:cursor-grabbing",
        `hover:bg-gradient-to-br ${hoverGradient}`
      )}
    >
       <div className={`absolute top-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-300 ${borderClass}`} />
       
       <div className="flex justify-between items-start mb-4 relative z-10">
         <div className={clsx("p-3.5 rounded-2xl shadow-lg transition-transform duration-300", colorClass)}>
             <motion.div
               animate={{ scale: [1, 1.1, 1] }}
               transition={{ duration: 1.5, repeat: Infinity, delay: delayIndex * 0.3, ease: "easeInOut" }}
             >
               <Icon className="w-6 h-6 text-white" />
             </motion.div>
         </div>
         
         {type === 'score' && (
           <CircularProgress value={value} size={48} strokeWidth={5} />
         )}
       </div>

       <div className="relative z-10">
         {type === 'score' ? (
           <div className="h-2" /> 
         ) : type === 'streak' ? (
           <div className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-1 tracking-tight">
              <FlipNumber value={value} delay={0.2} />
           </div>
         ) : (
           <div className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-1 tracking-tight">
             <CountUp end={value} duration={duration} onComplete={() => setShowTrend(true)} />
           </div>
         )}
         
         <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</div>
         
         {type === 'streak' ? (
            <StreakHeatmap history={history} />
         ) : (
            <TrendIndicator trend={trend} show={type === 'score' ? true : showTrend} />
         )}
       </div>
    </div>
  );
};

const ScoreBadge = ({ score }: { score: number }) => {
  let colorClass = "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400";
  if (score >= 80) colorClass = "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400";
  else if (score >= 60) colorClass = "bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400";
  
  return (
    <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shadow-sm transition-all relative", colorClass)}>
      {score}%
    </div>
  );
};

const RecentActivityItem: React.FC<{ item: QuizResult; index: number; isFirst: boolean }> = ({ item, index, isFirst }) => {
  const { removeResult } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x < -150) {
       removeResult(item.completedAt);
    }
  };

  return (
    <motion.div 
      layout 
      className="relative mb-4 group/item"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <div className="absolute inset-0 bg-red-500 rounded-2xl flex items-center justify-end px-6 text-white z-0">
        <Trash2 />
      </div>
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className={clsx(
          "relative z-10 bg-white dark:bg-dark-800 rounded-2xl p-4 border border-transparent transition-all duration-300 overflow-hidden",
          isHovered ? "bg-indigo-50/30 dark:bg-indigo-900/10 shadow-md border-indigo-100 dark:border-indigo-900/30 pl-6" : "hover:border-gray-100 dark:hover:border-dark-600"
        )}
      >
        <motion.div 
          initial={{ height: 0 }}
          animate={{ height: isHovered ? '100%' : 0 }}
          className="absolute left-0 top-0 w-1 bg-indigo-500"
        />
        <div className="flex items-center gap-4">
           <div className="relative">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className={clsx(
                   "absolute -left-[34px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white dark:border-dark-800 z-20",
                   isFirst ? "bg-indigo-500 animate-pulse" : "bg-gray-300 dark:bg-dark-600"
                )}
              />
              <ScoreBadge score={item.score} />
           </div>
           <div className="flex-1 min-w-0">
             <h4 className="font-semibold text-gray-900 dark:text-white truncate transition-colors group-hover/item:text-primary-600">
               {item.quizTitle}
             </h4>
             <div className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 gap-2 mt-1">
               <Clock className="w-3 h-3" />
               {new Date(item.completedAt).toLocaleDateString()}
             </div>
           </div>
           <ChevronRightIcon className="w-4 h-4 text-gray-300 group-hover/item:text-primary-500 group-hover/item:translate-x-1 transition-all" />
        </div>
      </motion.div>
    </motion.div>
  );
};

// ----------------------------------------------------------------------
// MAIN DASHBOARD COMPONENT
// ----------------------------------------------------------------------

export const Dashboard = () => {
  const { userStats, history, user, savedQuizzes, dashboardLayout, toggleDashboardLayout } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isLayoutChanging, setIsLayoutChanging] = useState(false);

  // Stats Reordering State
  const initialStats = ['quizzes', 'score', 'streak', 'questions'];
  const [statsOrder, setStatsOrder] = useState(initialStats);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000); // Increased for skeleton demo
    return () => clearTimeout(timer);
  }, []);

  const handleLayoutToggle = () => {
    setIsLayoutChanging(true);
    toggleDashboardLayout();
    setTimeout(() => setIsLayoutChanging(false), 600);
  };

  const chartData = history
    .slice()
    .reverse()
    .map((item, index) => ({
      name: `Quiz ${index + 1}`,
      score: item.score,
    }));

  const displayData = chartData.length > 0 ? chartData : [
    { name: 'Mon', score: 65 },
    { name: 'Tue', score: 75 },
    { name: 'Wed', score: 72 },
    { name: 'Thu', score: 85 },
    { name: 'Fri', score: 82 },
    { name: 'Sat', score: 90 },
    { name: 'Sun', score: 95 },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 100, damping: 15 },
      // Critical fix: Remove transform and filter after animation so that fixed children (full view widgets) 
      // are not trapped in a new stacking context.
      transitionEnd: { transform: "none", filter: "none" }
    }
  };

  const getStatComponent = (id: string) => {
    switch(id) {
      case 'quizzes':
        return (
          <StatCard 
            icon={BookOpen} 
            label="Total Quizzes" 
            value={userStats.totalQuizzes} 
            colorClass="bg-indigo-500" 
            hoverGradient="from-white to-indigo-50 dark:from-dark-800 dark:to-indigo-900/20"
            borderClass="bg-indigo-500"
            delayIndex={0}
            duration={1}
            trend={12}
          />
        );
      case 'score':
        return (
          <StatCard 
            icon={BarChart3} 
            label="Average Score" 
            value={userStats.averageScore} 
            type="score"
            colorClass="bg-emerald-500" 
            hoverGradient="from-white to-emerald-50 dark:from-dark-800 dark:to-emerald-900/20"
            borderClass="bg-emerald-500"
            delayIndex={1}
            duration={1.2}
            trend={5}
          />
        );
      case 'streak':
        return (
          <StatCard 
            icon={Flame} 
            label="Study Streak" 
            value={userStats.studyStreak} 
            type="streak"
            colorClass="bg-orange-500" 
            hoverGradient="from-white to-orange-50 dark:from-dark-800 dark:to-orange-900/20"
            borderClass="bg-orange-500"
            delayIndex={2}
            duration={0.8}
            history={history}
          />
        );
      case 'questions':
        return (
          <StatCard 
            icon={CheckCircle} 
            label="Questions Done" 
            value={userStats.totalQuestionsAnswered} 
            colorClass="bg-purple-500" 
            hoverGradient="from-white to-purple-50 dark:from-dark-800 dark:to-purple-900/20"
            borderClass="bg-purple-500"
            delayIndex={3}
            duration={1.5}
            trend={24}
          />
        );
      default: return null;
    }
  };

  return (
    <>
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className={clsx(
          "max-w-7xl mx-auto space-y-8 pb-8 transition-all duration-500"
        )}
      >
        <style>{`
          .preserve-3d { transform-style: preserve-3d; }
          .backface-hidden { backface-visibility: hidden; }
          .rotate-y-180 { transform: rotateY(180deg); }
        `}</style>

        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
          <motion.div variants={itemVariants} className="relative z-10">
            <TimeBasedGreeting name={user?.name?.split(' ')[0] || 'Student'} />
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-xl">
              Ready to expand your knowledge? You're on a <span className="font-bold text-orange-500">{userStats.studyStreak} day streak!</span>
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="relative z-10">
            <Link to="/create">
              <Button 
                  size="lg" 
                  className="h-14 px-8 shadow-xl shadow-primary-500/30 hover:shadow-primary-500/40 hover:-translate-y-1 transition-all"
                  magnetic
                  pulse
              >
                <motion.div
                   whileHover={{ rotate: 180 }}
                   transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                   <Plus className="w-5 h-5 mr-2" />
                </motion.div>
                Create New Quiz
              </Button>
            </Link>
          </motion.div>
          
          {/* Ambient background glow for header */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-primary-500/10 dark:bg-primary-500/5 blur-[100px] rounded-full -z-10 pointer-events-none" />
        </div>

        {/* Stats Grid - Reorderable */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Skeleton className="h-48 rounded-3xl" shimmerDelay={0} />
              <Skeleton className="h-48 rounded-3xl" shimmerDelay={0.1} />
              <Skeleton className="h-48 rounded-3xl" shimmerDelay={0.2} />
              <Skeleton className="h-48 rounded-3xl" shimmerDelay={0.3} />
          </div>
        ) : (
          <Reorder.Group 
              axis="x" 
              values={statsOrder} 
              onReorder={setStatsOrder} 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {statsOrder.map((item) => (
              <Reorder.Item 
                  key={item} 
                  value={item}
                  whileDrag={{ scale: 1.05, rotate: 3, zIndex: 50, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {getStatComponent(item)}
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}

        {/* Goal Tracking Section */}
        <motion.div variants={itemVariants}>
           {isLoading ? (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Skeleton className="h-40 rounded-2xl" shimmerDelay={0.3} />
                 <Skeleton className="h-40 rounded-2xl" shimmerDelay={0.4} />
                 <Skeleton className="h-40 rounded-2xl" shimmerDelay={0.5} />
               </div>
           ) : (
              <GoalsSection />
           )}
        </motion.div>

        {/* Main Content Split - Using DashboardWidget */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* Chart Section */}
          <motion.div variants={itemVariants} className="lg:col-span-2 relative">
             {isLoading ? (
                <Skeleton className="h-[450px] rounded-3xl" shimmerDelay={0.5} />
             ) : (
               <DashboardWidget 
                  id="analytics"
                  title="Performance Analytics" 
                  icon={Sparkles} 
                  onRefresh={() => new Promise(resolve => setTimeout(resolve, 1500))}
                  className="min-h-[450px]"
               >
                  <div className="h-[350px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={displayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={`rgb(var(--color-primary-500))`} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={`rgb(var(--color-primary-500))`} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-gray-700/50" />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} 
                          dy={10}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} 
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                            backdropFilter: 'blur(8px)',
                            borderRadius: '16px', 
                            border: '1px solid rgba(255,255,255,0.5)', 
                            boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.1)',
                            padding: '16px'
                          }}
                          itemStyle={{ color: `rgb(var(--color-primary-600))`, fontWeight: 700, fontSize: '14px' }}
                          cursor={{ stroke: `rgb(var(--color-primary-500))`, strokeWidth: 2, strokeDasharray: '4 4' }}
                          animationDuration={300}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="score" 
                          stroke={`rgb(var(--color-primary-600))`} 
                          strokeWidth={4}
                          fillOpacity={1} 
                          fill="url(#colorScore)" 
                          animationDuration={2000}
                          animationEasing="ease-out"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
               </DashboardWidget>
             )}
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={itemVariants} className="lg:col-span-1 relative">
             {isLoading ? (
                <Skeleton className="h-[450px] rounded-3xl" shimmerDelay={0.4} />
             ) : (
               <DashboardWidget 
                  id="activity"
                  title="Recent Activity" 
                  icon={Clock}
                  onRefresh={() => new Promise(resolve => setTimeout(resolve, 1000))}
                  isEmpty={history.length === 0}
                  emptyTitle="No activity"
                  emptyDescription="Your recent quizzes will appear here once you start learning."
                  emptyActionLabel="Create Quiz"
                  className="min-h-[450px]"
               >
                  <div className="flex-1 relative pl-4 mt-2">
                    {/* Timeline Line */}
                    <motion.div 
                       initial={{ height: 0 }}
                       animate={{ height: '100%' }}
                       transition={{ duration: 1.5, ease: "easeInOut" }}
                       className="absolute left-0 top-0 w-[2px] bg-gray-200 dark:bg-dark-600 rounded-full"
                    />

                    <div className="space-y-1">
                        <AnimatePresence mode="popLayout">
                          {history.slice(0, 5).map((item, idx) => (
                            <RecentActivityItem 
                              key={item.completedAt} 
                              item={item} 
                              index={idx}
                              isFirst={idx === 0} 
                            />
                          ))}
                        </AnimatePresence>
                    </div>
                  </div>
                  
                  {history.length > 0 && (
                     <motion.div 
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       transition={{ delay: 0.8 }}
                       className="mt-4"
                     >
                        <Link to="/history">
                          <Button variant="ghost" magnetic className="w-full border border-gray-200 dark:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-700">
                             View All History 
                             <motion.div
                                whileHover={{ y: [0, -4, 0] }}
                                transition={{ duration: 0.6, repeat: Infinity }}
                             >
                               <List className="w-4 h-4 ml-2" />
                             </motion.div>
                          </Button>
                        </Link>
                     </motion.div>
                  )}
               </DashboardWidget>
             )}
          </motion.div>
        </div>

        {/* Achievements Section */}
        <motion.div variants={itemVariants}>
           {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                 <Skeleton className="h-32 rounded-full" shimmerDelay={0.6} />
                 <Skeleton className="h-32 rounded-full" shimmerDelay={0.7} />
                 <Skeleton className="h-32 rounded-full" shimmerDelay={0.8} />
                 <Skeleton className="h-32 rounded-full" shimmerDelay={0.9} />
              </div>
           ) : (
              <Achievements />
           )}
        </motion.div>

        {/* Library Section (Saved Quizzes Flip Cards / List) */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-4">
               <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                 <Brain className="w-5 h-5 text-primary-500" />
                 Your Library
               </h2>
               <span className="text-sm text-gray-500">{savedQuizzes.length > 0 ? `${savedQuizzes.length} Saved` : 'Empty'}</span>
             </div>
             
             {/* Layout Toggle */}
             <div className="flex bg-gray-100 dark:bg-dark-800 rounded-lg p-1 border border-gray-200 dark:border-dark-700">
                <button 
                  onClick={handleLayoutToggle}
                  className={clsx(
                    "p-1.5 rounded-md transition-all",
                    dashboardLayout === 'grid' ? "bg-white dark:bg-dark-600 shadow-sm text-primary-600" : "text-gray-400 hover:text-gray-600"
                  )}
                  title="Grid View"
                >
                  <LayoutGrid size={16} />
                </button>
                <button 
                  onClick={handleLayoutToggle}
                  className={clsx(
                    "p-1.5 rounded-md transition-all",
                    dashboardLayout === 'list' ? "bg-white dark:bg-dark-600 shadow-sm text-primary-600" : "text-gray-400 hover:text-gray-600"
                  )}
                  title="List View"
                >
                  <LayoutList size={16} />
                </button>
             </div>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               <Skeleton className="h-48 rounded-2xl" shimmerDelay={0.6} />
               <Skeleton className="h-48 rounded-2xl" shimmerDelay={0.7} />
               <Skeleton className="h-48 rounded-2xl" shimmerDelay={0.8} />
               <Skeleton className="h-48 rounded-2xl" shimmerDelay={0.9} />
            </div>
          ) : (
            savedQuizzes.length > 0 ? (
              <motion.div 
                layout
                animate={{ 
                  opacity: isLayoutChanging ? 0.5 : 1,
                  filter: isLayoutChanging ? 'blur(2px)' : 'blur(0px)'
                }}
                transition={{ duration: 0.4 }}
                className={clsx(
                  dashboardLayout === 'grid' 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" 
                    : "flex flex-col gap-4"
                )}
              >
                <AnimatePresence>
                  {savedQuizzes.map((quiz, idx) => (
                    dashboardLayout === 'grid' ? (
                      <QuizFlipCard key={quiz.id} quiz={quiz} index={idx} />
                    ) : (
                      <QuizListItem key={quiz.id} quiz={quiz} index={idx} />
                    )
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="bg-white/50 dark:bg-dark-800/50 rounded-2xl p-8 border border-dashed border-gray-300 dark:border-dark-600 text-center flex flex-col items-center">
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-24 h-24 bg-gray-100 dark:bg-dark-700 rounded-full flex items-center justify-center mb-6"
                >
                  <BookOpen className="w-10 h-10 text-gray-400" />
                </motion.div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">No quizzes yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto leading-relaxed">
                  Generate a quiz from your notes to save it to your library and practice anytime.
                </p>
                <Link to="/create">
                  <Button>Create Your First Quiz</Button>
                </Link>
              </div>
            )
          )}
        </motion.div>

        {/* Footer Credit */}
        <motion.div 
          variants={itemVariants}
          className="mt-8 pt-8 border-t border-gray-200 dark:border-dark-700 text-center"
        >
          <p className="text-sm font-medium text-gray-400">
            LearnFlow AI Suite • Crafted with excellence by <span className="text-primary-500 font-bold hover:underline cursor-pointer">Divyansh</span>
          </p>
        </motion.div>
        
        {/* Floating Action Button (FAB) */}
        <AnimatePresence>
           {!isLoading && (
              <motion.div
                 initial={{ y: 100, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 exit={{ y: 100, opacity: 0 }}
                 transition={{ delay: 1, type: "spring", stiffness: 200, damping: 20 }}
                 className="fixed bottom-8 right-8 z-50 md:hidden"
              >
                 <Link to="/create">
                   <motion.button
                     whileHover={{ scale: 1.1, boxShadow: "0 25px 50px -12px rgba(99, 102, 241, 0.5)" }}
                     whileTap={{ scale: 0.9 }}
                     animate={{ rotate: [0, -2, 2, -2, 0] }}
                     transition={{ 
                       rotate: { repeat: Infinity, duration: 4, repeatDelay: 1, ease: "easeInOut" } 
                     }}
                     className="w-14 h-14 bg-gradient-to-r from-primary-600 to-secondary-500 rounded-full shadow-2xl flex items-center justify-center text-white"
                   >
                     <Plus size={24} strokeWidth={3} />
                   </motion.button>
                 </Link>
              </motion.div>
           )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};