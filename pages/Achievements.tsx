import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/store';
import { BadgeCard } from '../components/BadgeCard';
import { Award } from 'lucide-react';

export const Achievements = () => {
  const { badges } = useStore();
  
  // Sort badges: Unlocked first, then by progress
  const sortedBadges = [...badges].sort((a, b) => {
    if (a.isLocked === b.isLocked) {
        return (b.currentProgress / b.maxProgress) - (a.currentProgress / a.maxProgress);
    }
    return a.isLocked ? 1 : -1;
  });

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
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 10 } 
    }
  };

  return (
    <div className="py-8">
       <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl">
             <Award className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Achievements</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Track your milestones and badges</p>
          </div>
          
          <div className="ml-auto bg-gray-100 dark:bg-dark-700 px-4 py-2 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-300">
             {badges.filter(b => !b.isLocked).length} / {badges.length} Unlocked
          </div>
       </div>

       <motion.div
         variants={containerVariants}
         initial="hidden"
         whileInView="visible"
         viewport={{ once: true, margin: "-50px" }}
         className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 justify-items-center"
       >
          {sortedBadges.map((badge, index) => (
             <motion.div key={badge.id} variants={itemVariants}>
                <BadgeCard badge={badge} index={index} />
             </motion.div>
          ))}
       </motion.div>
    </div>
  );
};
