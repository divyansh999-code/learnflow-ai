import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  Settings, 
  Menu, 
  X, 
  Moon, 
  Sun,
  BrainCircuit,
  LogOut,
  Sparkles,
  Zap,
  Code,
  User,
  Layers
} from 'lucide-react';
import { useStore } from '../store';
import { clsx } from 'clsx';
import { UserProfile } from './UserProfile';
import { ThemeSelector } from './ui/ThemeSelector';

export const Layout = () => {
  const { theme, toggleTheme, user, logout } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: PlusCircle, label: 'Create Quiz', path: '/create' },
    { icon: Layers, label: 'Flashcards', path: '/flashcards' },
    { icon: History, label: 'History', path: '/history' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-dark-900 overflow-hidden font-sans transition-colors duration-300">
      <style>
        {`
          @keyframes gradient-x {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          .animate-gradient-x {
            animation: gradient-x 3s ease infinite;
            background-size: 200% auto;
          }
          @keyframes border-spin {
            100% { transform: rotate(360deg); }
          }
          .animate-border-spin {
            animation: border-spin 4s linear infinite;
          }
        `}
      </style>

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700 shadow-xl z-20 h-full">
        <div className="p-6 flex items-center gap-3 shrink-0">
          <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-2.5 rounded-xl shadow-lg shadow-primary-600/20 transition-all duration-500">
            <BrainCircuit className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-display font-bold text-gray-900 dark:text-white tracking-tight">LearnFlow</span>
        </div>

        {/* Scrollable Navigation Area */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => clsx(
                'flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative',
                isActive 
                  ? 'text-primary-600 dark:text-primary-400 font-bold' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-primary-50 dark:bg-primary-900/20 rounded-xl"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <div className="relative z-10 flex items-center gap-3">
                     <item.icon size={22} className={isActive ? "animate-pulse" : "group-hover:scale-110 transition-transform"} />
                     <span className="text-sm">{item.label}</span>
                  </div>
                  {item.path === '/create' && (
                     <span className="relative z-10 ml-auto bg-primary-100 text-primary-700 text-[10px] font-bold px-2 py-0.5 rounded-full dark:bg-primary-900 dark:text-primary-300">NEW</span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 pb-4 space-y-4 shrink-0">
          
           {/* Interactive User Profile Component */}
           <UserProfile />

          {/* Theme Controls */}
          <div className="p-3 bg-gray-50 dark:bg-dark-700/50 rounded-xl border border-gray-100 dark:border-dark-600 space-y-3">
             <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase">Appearance</span>
                <button 
                  onClick={toggleTheme} 
                  className="relative p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
                  aria-label="Toggle Dark Mode"
                >
                  <motion.div
                    initial={false}
                    animate={{ rotate: theme === 'dark' ? 180 : 0, scale: [0.8, 1.1, 1] }}
                    transition={{ duration: 0.4, type: "spring" }}
                  >
                    {theme === 'dark' ? <Moon size={16} className="text-indigo-400" /> : <Sun size={16} className="text-amber-500" />}
                  </motion.div>
                </button>
             </div>
             
             <div className="flex justify-between items-center">
                <ThemeSelector />
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-50 dark:bg-dark-900 transition-colors duration-300">
        {/* Topbar - Mobile */}
        <header className="md:hidden h-16 bg-white/80 dark:bg-dark-800/80 backdrop-blur-md border-b border-gray-200 dark:border-dark-700 flex items-center justify-between px-4 sticky top-0 z-30">
          <div className="flex items-center gap-2">
             <div className="bg-primary-600 p-1.5 rounded-lg">
                <BrainCircuit className="text-white w-5 h-5" />
             </div>
             <span className="font-display font-bold text-lg text-gray-900 dark:text-white">LearnFlow</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </header>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700 shadow-2xl z-40 md:hidden flex flex-col"
              >
                <div className="p-6 border-b border-gray-100 dark:border-dark-700 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                     <div className="bg-primary-600 p-1.5 rounded-lg">
                        <BrainCircuit className="text-white w-5 h-5" />
                     </div>
                     <span className="font-display font-bold text-lg dark:text-white">LearnFlow</span>
                  </div>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500">
                    <X size={20} />
                  </button>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-dark-700/50 border-b border-gray-100 dark:border-dark-600 shrink-0">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 flex items-center justify-center font-bold">
                        {user?.name?.charAt(0) || 'S'}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-900 dark:text-white">{user?.name || 'Student'}</div>
                        <div className="text-xs text-gray-500">{user?.email || 'student@example.com'}</div>
                      </div>
                   </div>
                </div>

                <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) => clsx(
                        'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors',
                        isActive 
                          ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 font-medium' 
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700'
                      )}
                    >
                      <item.icon size={20} />
                      {item.label}
                    </NavLink>
                  ))}
                  
                  <button 
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors mt-4"
                  >
                    <LogOut size={20} />
                    Logout
                  </button>
                </nav>

                <div className="p-4 border-t border-gray-100 dark:border-dark-700 bg-gray-50 dark:bg-dark-900/50 shrink-0">
                   <div className="flex items-center justify-between mb-4">
                      <ThemeSelector />
                      <button 
                        onClick={toggleTheme}
                        className="p-2 bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-600 shadow-sm"
                      >
                        {theme === 'dark' ? <Moon size={18} className="text-indigo-400" /> : <Sun size={18} className="text-amber-500" />}
                      </button>
                   </div>
                   
                   <div className="text-center">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Built By</p>
                      <p className="font-display font-black text-xl bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Divyansh</p>
                   </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 relative scroll-smooth">
           <AnimatePresence mode="wait">
             <motion.div
               key={location.pathname}
               initial={{ opacity: 0, y: 15, filter: 'blur(5px)' }}
               animate={{ 
                  opacity: 1, 
                  y: 0, 
                  filter: 'blur(0px)',
                  transitionEnd: { transform: "none", filter: "none" }
               }}
               exit={{ opacity: 0, y: -15, filter: 'blur(5px)' }}
               transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
               className="w-full h-full"
             >
               <Outlet />
             </motion.div>
           </AnimatePresence>
        </main>
      </div>
    </div>
  );
};