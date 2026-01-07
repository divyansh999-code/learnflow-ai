import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/store';
import { Avatar } from '../components/Avatar';
import { LevelProgress } from '../components/LevelProgress';
import { LogOut, User, Settings, Shield, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';

export const UserProfile = () => {
  const { user, userStats, logout } = useStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Typewriter State
  const [displayName, setDisplayName] = useState('');
  const [displayTitle, setDisplayTitle] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [typingPhase, setTypingPhase] = useState<'name' | 'title' | 'done'>('name');

  const fullName = user?.name || 'Student';
  const fullTitle = user?.title || 'Free Plan';

  // Typewriter Effect Logic
  useEffect(() => {
    // Reset state on mount
    setDisplayName('');
    setDisplayTitle('');
    setTypingPhase('name');
    setShowCursor(true);

    let currentIndex = 0;
    let timeout: any;

    const typeName = () => {
      if (currentIndex < fullName.length) {
        setDisplayName(fullName.slice(0, currentIndex + 1));
        currentIndex++;
        timeout = setTimeout(typeName, 40);
      } else {
        currentIndex = 0;
        setTypingPhase('title');
        timeout = setTimeout(typeTitle, 200); // Pause before title
      }
    };

    const typeTitle = () => {
      if (currentIndex < fullTitle.length) {
        setDisplayTitle(fullTitle.slice(0, currentIndex + 1));
        currentIndex++;
        timeout = setTimeout(typeTitle, 30); // Faster for title
      } else {
        setTypingPhase('done');
        // Blink cursor 3 times then fade
        let blinks = 0;
        const blinkInterval = setInterval(() => {
           setShowCursor(prev => !prev);
           blinks++;
           if (blinks > 5) {
             clearInterval(blinkInterval);
             setShowCursor(false);
           }
        }, 500);
      }
    };

    // Start typing
    timeout = setTimeout(typeName, 100);

    return () => clearTimeout(timeout);
  }, [fullName, fullTitle]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: User, label: 'My Profile', path: '/settings' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: Shield, label: 'Privacy', path: '#' },
  ];

  return (
    <div ref={containerRef} className="relative mt-auto">
      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute bottom-full left-0 w-full mb-4 bg-white dark:bg-dark-800 rounded-2xl shadow-xl border border-gray-100 dark:border-dark-600 overflow-hidden z-50 origin-bottom-left"
          >
             <div className="p-2 space-y-1">
               {menuItems.map((item, index) => (
                 <motion.div
                   key={item.label}
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: index * 0.04 }}
                 >
                   <Link 
                     to={item.path}
                     onClick={() => setIsOpen(false)}
                     className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group"
                   >
                     {/* Hover Highlight Slide */}
                     <motion.div 
                       className="absolute inset-0 bg-primary-50 dark:bg-primary-900/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                       layoutId="dropdown-highlight"
                     />
                     <div className="relative z-10 flex items-center gap-3">
                       <item.icon size={16} />
                       {item.label}
                     </div>
                   </Link>
                 </motion.div>
               ))}
               
               <div className="h-px bg-gray-100 dark:bg-dark-700 my-1" />
               
               <motion.button
                 initial={{ opacity: 0, x: -10 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: 0.15 }}
                 onClick={handleLogout}
                 className="relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
               >
                 <LogOut size={16} />
                 Sign Out
               </motion.button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Profile Trigger */}
      <div 
        className={clsx(
          "bg-gray-50 dark:bg-dark-700/50 rounded-2xl p-3 border border-gray-200 dark:border-dark-600 transition-all duration-300 cursor-pointer hover:shadow-md group",
          isOpen && "ring-2 ring-primary-500/50 border-primary-500"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <Avatar 
            src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.name || 'Divyansh'}&backgroundColor=e0e7ff`}
            fallback={user?.name?.[0] || 'S'}
            alt={user?.name || 'User'}
            className="ring-2 ring-white dark:ring-dark-800 shadow-sm"
          />
          
          <div className="flex-1 min-w-0">
            {/* Typewriter Name */}
            <div className="text-sm font-bold text-gray-900 dark:text-white truncate h-5 flex items-center">
               <span className="drop-shadow-sm">{displayName}</span>
               {showCursor && typingPhase === 'name' && (
                 <span className="w-0.5 h-4 bg-primary-500 ml-0.5 animate-pulse" />
               )}
            </div>
            
            {/* Typewriter Title */}
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate h-4 flex items-center">
              <span>{displayTitle}</span>
              {showCursor && (typingPhase === 'title' || typingPhase === 'done') && (
                 <span className="w-0.5 h-3 bg-gray-400 ml-0.5" />
               )}
            </div>
          </div>
        </div>

        {/* Level Progress */}
        <LevelProgress xp={userStats.xp} level={userStats.level} />
      </div>
    </div>
  );
};
