import React, { useEffect, useState } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { Share2, RotateCcw, Home, Award, Check } from 'lucide-react';
import { Button } from '../components/Button';
import { QuizResult } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import confetti from 'canvas-confetti';
import { Odometer } from '../components/ui/Odometer';

// CountUp Component (Kept for % as Odometer is better for integers usually, but we can reuse Odometer)
// Replacing with Odometer for consistency where applicable.

export const Results = () => {
  const location = useLocation();
  const result = location.state?.result as QuizResult;
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (result && result.score > 70) {
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#ec4899', '#10b981'],
          ticks: 200
        });
      }, 500); // Slight delay to match animation
    }
  }, [result]);

  if (!result) return <Navigate to="/dashboard" />;

  const pieData = [
    { name: 'Correct', value: result.correctCount, color: '#10b981' },
    { name: 'Incorrect', value: result.totalQuestions - result.correctCount, color: '#ef4444' },
  ];
  
  // Create simple bar data for visual demo of question performance (simulated)
  const barData = Array.from({ length: result.totalQuestions }).map((_, i) => ({
      name: `Q${i + 1}`,
      // Just visually simulating correct/incorrect logic based on result count for the chart
      score: i < result.correctCount ? 100 : 0, 
      fill: i < result.correctCount ? '#10b981' : '#ef4444'
  }));

  const handleShare = async () => {
    const text = `🎉 I just scored ${result.score}% on the "${result.quizTitle}" quiz in LearnFlow! Can you beat my score? 🚀`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-dark-800 rounded-3xl p-8 md:p-12 border border-gray-100 dark:border-dark-700 shadow-xl text-center space-y-12"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-block p-4 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mb-4"
          >
            <Award className="w-12 h-12 text-yellow-600 dark:text-yellow-400" />
          </motion.div>
          <h1 className="text-4xl font-display font-bold mb-2 text-gray-900 dark:text-white">
            {result.score >= 90 ? 'Outstanding!' : result.score >= 70 ? 'Great Job!' : 'Keep Practicing!'}
          </h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1"
          >
            You scored <span className="text-primary-600 dark:text-primary-400 font-bold flex items-center"><Odometer value={result.score} />%</span> on {result.quizTitle}
          </motion.p>
        </motion.div>

        <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-12 items-center">
          {/* Chart */}
          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={1500}
                  animationBegin={200}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, type: "spring" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
            >
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{result.correctCount}/{result.totalQuestions}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Correct</div>
            </motion.div>
          </div>

          {/* Stats Breakdown */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div whileHover={{ scale: 1.05 }} className="bg-gray-50 dark:bg-dark-700 p-4 rounded-2xl transition-shadow hover:shadow-md">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Time Spent</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{Math.floor(result.timeSpentSeconds / 60)}m {result.timeSpentSeconds % 60}s</div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="bg-gray-50 dark:bg-dark-700 p-4 rounded-2xl transition-shadow hover:shadow-md">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Accuracy</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{result.score}%</div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="bg-gray-50 dark:bg-dark-700 p-4 rounded-2xl transition-shadow hover:shadow-md">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Streak</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">🔥 +1</div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="bg-gray-50 dark:bg-dark-700 p-4 rounded-2xl transition-shadow hover:shadow-md">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">XP Earned</div>
              <div className="text-2xl font-bold text-primary-600 flex items-center gap-1">
                 +<Odometer value={result.score * 10} />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Animated Bar Chart Section (Scroll Triggered) */}
        <motion.div 
           variants={itemVariants} 
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-50px" }}
           className="w-full h-64 bg-gray-50 dark:bg-dark-700/30 rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold mb-4 text-left text-gray-800 dark:text-gray-200">Question Performance</h3>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={barData}>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-700" />
               <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
               <Tooltip 
                 cursor={{ fill: 'transparent' }}
                 contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
               />
               <Bar 
                 dataKey="score" 
                 radius={[4, 4, 0, 0]} 
                 animationDuration={1500}
                 animationBegin={500}
               >
                 {barData.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={entry.fill} />
                 ))}
               </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/dashboard">
            <Button variant="ghost" className="w-full sm:w-auto">
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          <Link to="/create">
            <motion.div
               animate={{ boxShadow: ["0 0 0 0px rgba(99, 102, 241, 0)", "0 0 0 4px rgba(99, 102, 241, 0.3)", "0 0 0 0px rgba(99, 102, 241, 0)"] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="rounded-xl"
            >
              <Button variant="secondary" className="w-full sm:w-auto">
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Another
              </Button>
            </motion.div>
          </Link>
          <Button 
            className="w-full sm:w-auto min-w-[160px]"
            onClick={handleShare}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 mr-2" />
                Share Result
              </>
            )}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};
