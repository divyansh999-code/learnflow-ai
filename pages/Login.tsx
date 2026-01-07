import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Mail, Lock, ArrowRight, User, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { supabase } from '../services/supabase';

export const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    // Standard HTML5 Email Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!cleanEmail) {
      setError('Please enter your email address.');
      setIsLoading(false);
      return;
    }

    if (!emailRegex.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }
    
    try {
      if (isLogin) {
        // --- LOGIN LOGIC ---
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password
        });
        
        if (error) {
           // Simplify error messages
           if (error.message.includes('Invalid login')) {
             throw new Error('Invalid email or password.');
           } else if (error.message.includes('Failed to fetch')) {
             throw new Error('Connection failed. Please check your internet connection or project configuration.');
           }
           throw error;
        }

        if (data.session) {
          navigate('/dashboard');
        }
      } else {
        // --- SIGN UP LOGIC ---
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              name: cleanName || 'Student'
            }
          }
        });
        
        if (error) throw error;
        
        // If email confirmation is disabled in Supabase (which it should be for this portfolio),
        // data.session will be present immediately.
        if (data.session) {
          navigate('/dashboard');
        } else {
          // If session is missing, it usually means verification is still ON in Supabase.
          // We try to auto-login anyway just in case.
          const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password
          });

          if (loginData.session) {
            navigate('/dashboard');
          } else {
            // Fallback if backend still enforces verification
            setError('Account created, but auto-login failed. Please check your Supabase "Confirm Email" settings.');
          }
        }
      }
    } catch (err: any) {
      console.error('Auth Error:', err);
      let msg = err.message || 'Authentication failed.';
      msg = msg.replace('AuthApiError: ', '');
      
      if (msg.includes('Failed to fetch')) {
        msg = 'Unable to connect to Supabase. Missing environment variables?';
      }
      
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  const inputVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: { delay: 0.2 + (i * 0.05), duration: 0.4, ease: "easeOut" }
    })
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900 px-4 py-12">
      <div className="w-full max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-3 rounded-xl shadow-lg shadow-primary-600/20">
              <BrainCircuit className="text-white w-8 h-8" />
            </div>
          </div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {isLogin ? 'Enter your details to access your workspace' : 'Start your AI-powered learning journey today'}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5,
            ease: "easeOut",
            delay: 0.1 
          }}
          className="bg-white dark:bg-dark-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-dark-700 ring-1 ring-black/5"
        >
          <motion.form 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit} 
            className="space-y-5"
          >
            {!isLogin && (
              <motion.div custom={0} variants={inputVariants} initial="hidden" animate="visible">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="text" 
                    required={!isLogin}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    placeholder="John Doe"
                    autoComplete="name"
                  />
                </div>
              </motion.div>
            )}

            <motion.div custom={1} variants={inputVariants} initial="hidden" animate="visible">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={handleEmailChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="you@example.com"
                  autoComplete="email"
                  spellCheck={false}
                  autoCapitalize="none"
                />
              </div>
            </motion.div>

            <motion.div custom={2} variants={inputVariants} initial="hidden" animate="visible">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="••••••••"
                  minLength={6}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                />
              </div>
            </motion.div>

            {error && (
              <div className="text-red-500 text-sm flex items-start gap-2 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg animate-pulse">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <motion.div custom={3} variants={inputVariants} initial="hidden" animate="visible" className="pt-2">
              <Button type="submit" size="lg" className="w-full" disabled={isLoading} disableShimmer>
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Please wait...
                  </>
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </motion.div>
          </motion.form>

          <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 text-center"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={switchMode}
                className="ml-2 font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
