import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store';
import { GoalCard } from './ui/GoalCard';
import { Target, ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';
import { Link } from 'react-router-dom';

export const GoalsSection = () => {
  const { goals } = useStore();

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
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-6">
         <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
               <h3 className="font-bold text-gray-900 dark:text-white text-xl">Current Goals</h3>
               <p className="text-xs text-gray-500">Stay on track with your learning targets</p>
            </div>
         </div>
         <Link to="/goals">
           <Button variant="ghost" size="sm" className="hidden sm:flex">
              View All <ArrowRight size={14} className="ml-1" />
           </Button>
         </Link>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {goals.slice(0, 3).map((goal) => (
          <motion.div key={goal.id} variants={itemVariants}>
            <GoalCard goal={goal} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};