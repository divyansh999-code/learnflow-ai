import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/store';
import { GoalCard } from '../components/ui/GoalCard';
import { Target, Plus, TrendingUp, Trophy, Flame, Clock, X, Check } from 'lucide-react';
import { Button } from '../components/Button';
import { Goal } from '../types';
import { clsx } from 'clsx';

export const Goals = () => {
  const { goals, addGoal } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Goal>>({
    title: '',
    description: '',
    target: 10,
    unit: 'quizzes',
    category: 'quiz',
    colorTheme: 'blue',
  });

  const categories = [
    { id: 'quiz', label: 'Quiz Count', icon: Target },
    { id: 'streak', label: 'Streak', icon: Flame },
    { id: 'score', label: 'High Score', icon: Trophy },
    { id: 'time', label: 'Study Time', icon: Clock }
  ];

  const colors = [
    { id: 'blue', bg: 'bg-blue-500' },
    { id: 'purple', bg: 'bg-purple-500' },
    { id: 'orange', bg: 'bg-orange-500' },
    { id: 'green', bg: 'bg-emerald-500' }
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    addGoal({
      id: `g-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      target: Number(formData.target) || 10,
      unit: formData.unit || 'units',
      current: 0,
      category: (formData.category as any) || 'quiz',
      colorTheme: (formData.colorTheme as any) || 'blue'
    });

    setIsModalOpen(false);
    setFormData({
      title: '',
      description: '',
      target: 10,
      unit: 'quizzes',
      category: 'quiz',
      colorTheme: 'blue',
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
           <div className="p-3.5 bg-blue-100 dark:bg-blue-900/30 rounded-2xl shadow-sm">
             <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
           </div>
           <div>
             <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Goals & Targets</h1>
             <p className="text-gray-500 dark:text-gray-400">Track, manage, and crush your learning objectives</p>
           </div>
        </div>
        <Button 
          className="shadow-lg shadow-primary-500/20"
          onClick={() => setIsModalOpen(true)}
        >
           <Plus className="w-5 h-5 mr-2" />
           New Goal
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-dark-800 p-6 rounded-2xl border border-gray-100 dark:border-dark-700 shadow-sm flex items-center gap-4">
           <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
             <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
           </div>
           <div>
             <div className="text-2xl font-bold text-gray-900 dark:text-white">{goals.filter(g => g.current >= g.target).length}</div>
             <div className="text-sm text-gray-500">Completed</div>
           </div>
        </div>
        <div className="bg-white dark:bg-dark-800 p-6 rounded-2xl border border-gray-100 dark:border-dark-700 shadow-sm flex items-center gap-4">
           <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
             <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
           </div>
           <div>
             <div className="text-2xl font-bold text-gray-900 dark:text-white">{goals.filter(g => g.current < g.target).length}</div>
             <div className="text-sm text-gray-500">In Progress</div>
           </div>
        </div>
        <div className="bg-white dark:bg-dark-800 p-6 rounded-2xl border border-gray-100 dark:border-dark-700 shadow-sm flex items-center gap-4">
           <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
             <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
           </div>
           <div>
             <div className="text-2xl font-bold text-gray-900 dark:text-white">{goals.length}</div>
             <div className="text-sm text-gray-500">Total Goals</div>
           </div>
        </div>
      </div>

      {/* Goals Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {goals.map((goal) => (
          <motion.div key={goal.id} variants={itemVariants}>
            <GoalCard goal={goal} />
          </motion.div>
        ))}
        
        {/* Add Goal Placeholder */}
        <motion.div variants={itemVariants}>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full h-full min-h-[180px] rounded-2xl border-2 border-dashed border-gray-200 dark:border-dark-700 flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-primary-500 hover:border-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all group"
          >
             <div className="p-3 rounded-full bg-gray-100 dark:bg-dark-700 group-hover:bg-white dark:group-hover:bg-dark-600 transition-colors">
               <Plus className="w-6 h-6" />
             </div>
             <span className="font-medium">Add New Goal</span>
          </button>
        </motion.div>
      </motion.div>

      {/* Add Goal Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsModalOpen(false)}
               className="absolute inset-0 bg-black/50 backdrop-blur-sm"
             />
             <motion.div
               initial={{ scale: 0.95, opacity: 0, y: 10 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.95, opacity: 0, y: 10 }}
               className="relative bg-white dark:bg-dark-800 rounded-3xl p-8 w-full max-w-lg shadow-2xl border border-gray-100 dark:border-dark-700 z-10"
             >
                <div className="flex justify-between items-center mb-6">
                   <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Goal</h2>
                   <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-full transition-colors">
                      <X size={20} className="text-gray-500" />
                   </button>
                </div>

                <form onSubmit={handleCreate} className="space-y-5">
                   <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Goal Title</label>
                      <input 
                        required
                        type="text"
                        placeholder="e.g., Summer Reading Challenge"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                      />
                   </div>

                   <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
                      <input 
                        required
                        type="text"
                        placeholder="What do you want to achieve?"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                      />
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Target Value</label>
                         <input 
                           required
                           type="number"
                           min="1"
                           value={formData.target}
                           onChange={(e) => setFormData({...formData, target: parseInt(e.target.value)})}
                           className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                         />
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Unit</label>
                         <input 
                           required
                           type="text"
                           placeholder="e.g., books, days"
                           value={formData.unit}
                           onChange={(e) => setFormData({...formData, unit: e.target.value})}
                           className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                         />
                      </div>
                   </div>

                   <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                      <div className="grid grid-cols-4 gap-2">
                         {categories.map((cat) => (
                            <button
                               key={cat.id}
                               type="button"
                               onClick={() => setFormData({...formData, category: cat.id as any})}
                               className={clsx(
                                  "flex flex-col items-center justify-center gap-1 p-3 rounded-xl border transition-all",
                                  formData.category === cat.id 
                                    ? "bg-primary-50 dark:bg-primary-900/30 border-primary-500 text-primary-600 dark:text-primary-400 ring-1 ring-primary-500" 
                                    : "border-gray-200 dark:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-700 text-gray-500"
                               )}
                            >
                               <cat.icon size={20} />
                               <span className="text-[10px] font-medium">{cat.label}</span>
                            </button>
                         ))}
                      </div>
                   </div>

                   <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme Color</label>
                      <div className="flex gap-3">
                         {colors.map((c) => (
                            <button
                               key={c.id}
                               type="button"
                               onClick={() => setFormData({...formData, colorTheme: c.id as any})}
                               className={clsx(
                                  "w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110",
                                  c.bg,
                                  formData.colorTheme === c.id && "ring-2 ring-offset-2 ring-gray-400 dark:ring-white dark:ring-offset-dark-800"
                               )}
                            >
                               {formData.colorTheme === c.id && <Check className="text-white w-5 h-5" />}
                            </button>
                         ))}
                      </div>
                   </div>

                   <div className="pt-4 flex gap-3">
                      <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="flex-1">
                         Cancel
                      </Button>
                      <Button type="submit" className="flex-1">
                         Create Goal
                      </Button>
                   </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
