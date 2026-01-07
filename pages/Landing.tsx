import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, Variants, useScroll, useMotionValueEvent, useMotionValue, useTransform, useSpring, useInView } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { BrainCircuit, Upload, Award, ChevronRight, Zap, Sparkles, Heart, FileText, CheckCircle, BarChart3, Layers, Globe, Check, Star, Trophy } from 'lucide-react';
import { Button } from '../components/Button';
import { TextScramble } from '../components/ui/TextScramble';
import { CursorTrail } from '../components/ui/CursorTrail';
import confetti from 'canvas-confetti';

// Helper for confetti
const triggerPrimaryConfetti = () => {
  confetti({ 
    particleCount: 150, 
    spread: 60, 
    origin: { y: 0.6 }, 
    colors: ['#6366f1', '#a855f7', '#ec4899'] 
  });
};

const triggerDemoConfetti = () => {
  const end = Date.now() + 1000;
  const colors = ['#fbbf24', '#f59e0b', '#ffffff'];
  (function frame() {
    confetti({ 
      particleCount: 2, 
      angle: 60, 
      spread: 55, 
      origin: { x: 0, y: 0 }, 
      colors 
    });
    confetti({ 
      particleCount: 2, 
      angle: 120, 
      spread: 55, 
      origin: { x: 1, y: 0 }, 
      colors 
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  }());
};

const triggerFinalConfetti = () => {
  const duration = 2000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 90,
      spread: 100,
      origin: { x: 0.5, y: 1 },
      colors: ['#6366f1', '#ec4899', '#10b981'],
      scalar: 1.2
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  }());
};

// Typewriter effect component
const TypewriterText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState('');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  useEffect(() => {
    if (!isInView) return;
    let i = 0;
    setDisplayText('');
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [text, isInView]);

  return (
    <span ref={ref} className="inline">
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="inline-block w-0.5 h-5 ml-1 bg-current align-middle"
      />
    </span>
  );
};

// Highlight Text Component for Scroll Triggered Highlighting
const HighlightText = ({ text, keywords }: { text: string; keywords: string[] }) => {
  if (!keywords || keywords.length === 0) return <>{text}</>;
  
  // Create a regex to split by keywords, keeping delimiters
  const pattern = new RegExp(`(${keywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  const parts = text.split(pattern);
  
  return (
    <>
      {parts.map((part, i) => {
        const isKeyword = keywords.some(k => k.toLowerCase() === part.toLowerCase());
        if (isKeyword) {
          return (
            <span key={i} className="relative inline-block z-0">
              <span className="relative z-10 font-semibold">{part}</span>
              <motion.span 
                className="absolute left-0 bottom-0.5 w-full h-1/2 bg-yellow-200/60 dark:bg-yellow-500/30 -z-10 rounded-sm"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ amount: 1, once: true }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{ originX: 0 }}
              />
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
};

// New CTA Section Component
const CTASection = () => {
  const icons = [
    { Icon: Star, delay: 0, x: "10%", size: 24 },
    { Icon: CheckCircle, delay: 2, x: "85%", size: 32 },
    { Icon: Trophy, delay: 4, x: "20%", size: 40 },
    { Icon: Zap, delay: 1, x: "70%", size: 28 },
    { Icon: Star, delay: 5, x: "40%", size: 20 },
    { Icon: CheckCircle, delay: 3, x: "60%", size: 36 },
    { Icon: BrainCircuit, delay: 1.5, x: "30%", size: 30 },
    { Icon: Heart, delay: 3.5, x: "50%", size: 24 },
  ];

  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "100px" });

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      {/* 33. Gradient Background Animation */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 animate-gradient-xy" 
        style={{ backgroundSize: "200% 200%" }} 
      />
      
      {/* Noise Texture */}
      <div 
        className="absolute inset-0 opacity-[0.05] animate-pulse-slow pointer-events-none" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      {/* 34. Dot Grid Movement */}
      {isInView && (
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 z-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 2px, transparent 2.5px)',
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
          }}
        />
      )}

      {/* 36. Floating Success Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {isInView && icons.map((item, i) => (
          <motion.div
            key={i}
            className="absolute bottom-0 text-white/20"
            style={{ left: item.x }}
            initial={{ y: 100, opacity: 0, rotate: 0 }}
            animate={{ 
              y: -400, 
              opacity: [0, 0.4, 0], 
              rotate: [0, 45] 
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: item.delay,
              ease: "linear"
            }}
          >
            <item.Icon size={item.size} />
          </motion.div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-4 relative z-10 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">
            Ready to Learn Faster?
          </h2>
          <p className="text-xl md:text-2xl text-indigo-100 mb-12 max-w-2xl mx-auto leading-relaxed opacity-90">
            Join thousands of students mastering their subjects with LearnFlow's AI-powered tools.
          </p>
          
          <div className="flex justify-center">
            <Link to="/login">
              <div className="relative group">
                {/* 35. CTA Button Attention Pulse */}
                <motion.div
                  animate={{ scale: [1, 1.5], opacity: [0.4, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 bg-white rounded-2xl z-0"
                />
                <motion.button
                   whileHover={{ scale: 1.05 }}
                   animate={{ scale: [1, 1.02, 1] }}
                   transition={{ 
                     scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                     whileHover: { duration: 0.2 }
                   }}
                   onClick={(e) => {
                     // The link will handle navigation, but we add effect here
                     triggerFinalConfetti();
                   }}
                   className="relative z-10 bg-white text-indigo-600 px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-indigo-900/20 hover:bg-indigo-50 transition-all flex items-center gap-3"
                >
                  Start Learning Now 
                  <ChevronRight className="w-6 h-6" />
                </motion.button>
              </div>
            </Link>
          </div>
          
          <div className="mt-12 flex items-center justify-center gap-8 text-indigo-100/60 text-sm font-medium">
             <div className="flex items-center gap-2">
               <CheckCircle size={16} /> No credit card required
             </div>
             <div className="flex items-center gap-2">
               <CheckCircle size={16} /> Free forever plan
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// 3D Feature Card Component
const FeatureCard: React.FC<{ feature: any; index: number; onLearnMore: () => void }> = ({ feature, index, onLearnMore }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: { 
          opacity: 1, 
          y: 0, 
          transition: { 
            duration: 0.6,
            ease: [0.34, 1.56, 0.64, 1] // Custom overshoot bezier
          } 
        }
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      // Sticky stacking for mobile, grid for larger screens
      className="group perspective-1000 h-[360px] sticky top-24 md:static md:block"
      style={{ 
        // Dynamic top offset for stacking effect on mobile
        top: `calc(6rem + ${index * 1.5}rem)`,
        zIndex: 10 + index
      }}
    >
      <div className="relative w-full h-full transition-all duration-[600ms] ease-in-out preserve-3d group-hover:rotate-y-180">
        
        {/* Front Face */}
        <div className="absolute inset-0 backface-hidden bg-white dark:bg-dark-800 rounded-3xl border border-gray-100 dark:border-dark-700 p-8 flex flex-col items-center text-center overflow-hidden transition-all duration-300 shadow-sm group-hover:shadow-2xl group-hover:bg-gradient-to-br group-hover:from-indigo-50 group-hover:to-purple-50 dark:group-hover:from-dark-700 dark:group-hover:to-dark-600">
          
          {/* Drawing Border */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none rounded-3xl z-0">
             <defs>
               <linearGradient id={`border-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                 <stop offset="0%" stopColor="#6366f1" />
                 <stop offset="100%" stopColor="#ec4899" />
               </linearGradient>
               <filter id={`glow-${index}`}>
                 <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                 <feMerge>
                   <feMergeNode in="coloredBlur"/>
                   <feMergeNode in="SourceGraphic"/>
                 </feMerge>
               </filter>
             </defs>
             <motion.rect
               width="100%"
               height="100%"
               x="0"
               y="0"
               rx="24"
               ry="24"
               fill="none"
               stroke={`url(#border-${index})`}
               strokeWidth="2"
               filter={`url(#glow-${index})`}
               initial={{ pathLength: 0, opacity: 0 }}
               whileHover={{ pathLength: 1, opacity: 1 }}
               transition={{ duration: 0.8, ease: "easeInOut" }}
             />
          </svg>

          {/* Background Gradient Blob */}
          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} opacity-10 rounded-bl-[100px] transition-transform duration-500 group-hover:scale-150`} />

          {/* Icon Container with Morph Animation */}
          <div className="relative mb-6 z-10">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center transition-colors duration-500 bg-indigo-100 dark:bg-indigo-900/30 group-hover:bg-indigo-600">
                <motion.div
                  whileHover={{ 
                    rotate: [0, 10, -5, 0],
                    scale: [1, 1.1, 1],
                    transition: { duration: 0.6, times: [0, 0.3, 0.6, 1], ease: "easeInOut" }
                  }}
                >
                   <feature.icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400 transition-colors duration-500 group-hover:text-white" />
                </motion.div>
            </div>
          </div>

          <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white relative z-10 transition-colors duration-500 group-hover:text-indigo-900 dark:group-hover:text-white">
            {feature.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed relative z-10">
            <HighlightText text={feature.desc} keywords={feature.keywords} />
          </p>
          
          <div className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
             <span className="text-xs font-bold uppercase tracking-widest text-indigo-500">Hover to flip</span>
          </div>
        </div>

        {/* Back Face */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white dark:bg-dark-800 rounded-3xl border border-primary-100 dark:border-dark-600 p-8 shadow-sm transition-shadow duration-300 group-hover:shadow-2xl flex flex-col justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 rounded-3xl" />
          
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Key Features
          </h4>
          
          <ul className="space-y-4 relative z-10">
            {feature.details.map((detail: string, i: number) => (
              <li key={i} className="flex items-center gap-3 text-left">
                <div className="min-w-[24px] h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{detail}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex justify-center">
             <Button size="sm" variant="outline" onClick={(e) => { e.preventDefault(); onLearnMore(); }} className="w-full border-primary-200 hover:bg-primary-50 text-primary-700">
               Learn More <ChevronRight size={14} className="ml-1" />
             </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Parallax Background Component with InView optimization
const ParallaxBackground = ({ 
  blob1X, blob1Y, 
  blob2X, blob2Y, 
  blob3X, blob3Y, 
  particles 
}: any) => {
  const ref = useRef(null);
  const isInView = useInView(ref);

  return (
    <div ref={ref} className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-100/40 via-gray-50/0 to-gray-50/0 dark:from-primary-900/20 dark:via-dark-900/0 dark:to-dark-900/0" />
      
      {isInView && (
        <>
          {/* Blob 1 */}
          <motion.div 
            style={{ x: blob1X, y: blob1Y }}
            animate={{ 
              y: [-30, 30, -30],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-primary-500/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen"
          />
          
          {/* Blob 2 */}
          <motion.div 
            style={{ x: blob2X, y: blob2Y }}
            animate={{ 
              y: [30, -30, 30],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-40 -right-20 w-[500px] h-[500px] bg-secondary-500/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen"
          />

          {/* Blob 3 */}
          <motion.div 
            style={{ x: blob3X, y: blob3Y }}
            animate={{ 
              y: [-20, 20, -20],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[80px] mix-blend-multiply dark:mix-blend-screen"
          />

          {/* Floating Particles */}
          {particles.map((p: any) => (
            <motion.div
              key={p.id}
              className="absolute bg-indigo-400/20 dark:bg-white/10 rounded-full blur-[1px]"
              style={{
                width: p.size,
                height: p.size,
                left: p.left,
                top: p.top,
              }}
              animate={{
                y: [0, -200],
                opacity: [0, 0.1, 0]
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: "linear"
              }}
            />
          ))}

          {/* Light Ray Sweep */}
          <motion.div 
            className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-12"
            animate={{ x: ['0%', '100%'] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear", repeatDelay: 5 }}
          />
        </>
      )}
    </div>
  );
};

export const Landing = () => {
  const navigate = useNavigate();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const { scrollY } = useScroll();
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Parallax State
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 150 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  // Background Parallax Transforms
  const blob1X = useTransform(mouseXSpring, [-0.5, 0.5], ['-2%', '2%']); 
  const blob1Y = useTransform(mouseYSpring, [-0.5, 0.5], ['-2%', '2%']);
  const blob2X = useTransform(mouseXSpring, [-0.5, 0.5], ['1%', '-1%']);
  const blob2Y = useTransform(mouseYSpring, [-0.5, 0.5], ['1%', '-1%']);
  const blob3X = useTransform(mouseXSpring, [-0.5, 0.5], ['-1.5%', '1.5%']);
  const blob3Y = useTransform(mouseYSpring, [-0.5, 0.5], ['-1.5%', '1.5%']);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize -0.5 to 0.5
      mouseX.set((e.clientX / window.innerWidth) - 0.5);
      mouseY.set((e.clientY / window.innerHeight) - 0.5);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY;
    if (latest > previous && latest > 150) {
      setIsNavVisible(false); // Hide when scrolling down
    } else {
      setIsNavVisible(true); // Show when scrolling up
    }
    setLastScrollY(latest);
  });

  const handleStartLearning = (e: React.MouseEvent) => {
    e.preventDefault();
    triggerPrimaryConfetti();
    setIsBtnLoading(true);
    setTimeout(() => {
      setIsBtnLoading(false);
      navigate('/login');
    }, 1200);
  };

  const smoothScrollTo = (targetId: string) => {
    const element = document.getElementById(targetId);
    if (!element) return;

    const targetPosition = element.getBoundingClientRect().top + window.scrollY;
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    const speed = 800; // px per second
    const duration = Math.abs(distance) / speed * 1000;
    let start: number | null = null;
    
    // Animate the progress bar first
    setScrollProgress(100);
    setTimeout(() => {
        window.requestAnimationFrame(step);
    }, 200);

    function step(timestamp: number) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const percentage = Math.min(progress / duration, 1);
      
      // Ease-in-out quart
      const ease = percentage < 0.5 ? 8 * percentage * percentage * percentage * percentage : 1 - Math.pow(-2 * percentage + 2, 4) / 2;
      
      window.scrollTo(0, startPosition + distance * ease);

      if (progress < duration) {
        window.requestAnimationFrame(step);
      } else {
        // Reset bar after scroll
        setTimeout(() => setScrollProgress(0), 500);
      }
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  // Generate particles
  const particles = useMemo(() => Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 6 + 4,
    duration: Math.random() * 7 + 8,
    delay: Math.random() * 5,
  })), []);

  const features = [
    { 
      icon: Upload, 
      title: 'Smart Analysis', 
      desc: 'Paste any text or upload notes. Our AI understands context and extracts key concepts instantly.',
      keywords: ['AI understands context', 'extracts key concepts'],
      color: 'bg-blue-500',
      gradient: 'from-blue-500 to-indigo-600',
      details: ['PDF, DOCX & Text Support', 'Context-Aware Extraction', 'Multi-Language Support']
    },
    { 
      icon: Zap, 
      title: 'Instant Quizzes', 
      desc: 'Generate multiple-choice, true/false, and short answer questions tailored to your difficulty level.',
      keywords: ['tailored to your difficulty'],
      color: 'bg-amber-500',
      gradient: 'from-amber-400 to-orange-500',
      details: ['Adaptive Difficulty', 'Various Question Types', 'Instant Explanations']
    },
    { 
      icon: Award, 
      title: 'Progress Tracking', 
      desc: 'Visualize your improvement over time with detailed analytics and performance charts.',
      keywords: ['improvement over time', 'detailed analytics'],
      color: 'bg-emerald-500',
      gradient: 'from-emerald-400 to-teal-500',
      details: ['Learning Velocity Charts', 'Topic Mastery Heatmaps', 'Weekly Streaks']
    },
    { 
      icon: BrainCircuit, 
      title: 'AI Tutor', 
      desc: 'Get personalized explanations for every answer. The AI adapts to your learning style.',
      keywords: ['personalized explanations', 'adapts to your learning'],
      color: 'bg-purple-500',
      gradient: 'from-purple-500 to-pink-600',
      details: ['Socratic Method', 'Personalized Analogies', '24/7 Availability']
    },
    { 
      icon: Layers, 
      title: 'Flashcards', 
      desc: 'Automatically convert your notes into spaced repetition flashcards for long-term retention.',
      keywords: ['spaced repetition', 'long-term retention'],
      color: 'bg-rose-500',
      gradient: 'from-rose-500 to-red-600',
      details: ['Spaced Repetition', 'Smart Shuffling', 'Visual & Audio Cards']
    },
    { 
      icon: Globe, 
      title: 'Global Knowledge', 
      desc: 'Access a vast library of pre-generated quizzes on thousands of academic topics.',
      keywords: ['vast library', 'academic topics'],
      color: 'bg-cyan-500',
      gradient: 'from-cyan-500 to-blue-600',
      details: ['Community Library', 'Trending Topics', 'Verified Content']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 text-gray-900 dark:text-white selection:bg-primary-500/30">
      <style>{`
        @keyframes gradient-flow {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .animate-gradient-flow {
          background-size: 200% auto;
          animation: gradient-flow 1.5s linear infinite;
        }
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        .animate-grid-move {
          animation: grid-move 20s linear infinite;
        }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        
        /* New CTA Animations */
        @keyframes gradient-xy {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-xy {
          animation: gradient-xy 8s ease infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.15; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
      
      {/* 37. Smooth Scroll Anchoring Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-1 z-[100]">
        <motion.div 
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${scrollProgress}%` }}
            transition={{ duration: 0.2 }}
        />
      </div>

      {/* Navigation */}
      <motion.nav 
        initial={{ y: 0 }}
        animate={{ y: isNavVisible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed w-full z-50 bg-white/80 dark:bg-dark-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-dark-700/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => smoothScrollTo('hero-section')}
            >
              <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-2.5 rounded-xl shadow-lg shadow-primary-600/20">
                <BrainCircuit className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">
                LearnFlow
              </span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <Link to="/login">
                <Button size="sm" variant="ghost" className="hidden sm:flex">Sign In</Button>
              </Link>
              <Link to="/login">
                <Button size="sm" className="shadow-lg shadow-primary-500/25">Get Started</Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id="hero-section" className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden min-h-[80vh] flex flex-col justify-center">
        
        {/* Animated Grid Pattern Background */}
        <div className="absolute inset-0 overflow-hidden -z-20 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.07] animate-grid-move" 
             style={{ 
               backgroundImage: 'radial-gradient(circle, currentColor 2px, transparent 2.5px)', 
               backgroundSize: '50px 50px',
               maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
               WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'
             }} 
          />
        </div>

        {/* Premium Background Effects & Parallax Blobs */}
        <ParallaxBackground 
           blob1X={blob1X} blob1Y={blob1Y} 
           blob2X={blob2X} blob2Y={blob2Y} 
           blob3X={blob3X} blob3Y={blob3Y} 
           particles={particles} 
        />

        {/* Cursor Trail Effect */}
        <CursorTrail />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="flex flex-col items-center justify-center text-center">
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-5xl mx-auto"
            >
              {/* Floating Badge */}
              <motion.div 
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.5, duration: 1.2 }}
                className="flex justify-center mb-8"
              >
                <motion.div 
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="group relative flex items-center gap-3 px-6 py-2.5 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-none backdrop-blur-xl cursor-default overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Sparkles size={16} className="text-secondary-500 fill-secondary-500 animate-pulse" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Crafted by
                  </span>
                  <span className="text-sm font-bold text-primary-600 dark:text-primary-400 drop-shadow-sm tracking-wide">
                    Divyansh
                  </span>
                </motion.div>
              </motion.div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-8 tracking-tight leading-[1.1]">
                <TextScramble text="Master Any Subject" className="inline-block" duration={1000} />
                <br />
                <span className="relative inline-block mt-2">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 via-pink-500 to-indigo-500 animate-gradient-flow">
                    With AI Speed
                  </span>
                  <span className="absolute -bottom-2 left-0 w-full h-3 bg-primary-200/50 dark:bg-primary-900/50 -rotate-1 rounded-full blur-sm" />
                </span>
              </h1>
              
              <div className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed min-h-[90px]">
                <TypewriterText text="Upload your notes, PDFs, or articles. LearnFlow instantly generates interactive quizzes, tracks your progress, and helps you learn 10x faster." />
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-5"
              >
                <Button 
                  size="lg" 
                  onClick={handleStartLearning}
                  isLoading={isBtnLoading}
                  magnetic
                  withShimmer
                  className="h-16 px-12 text-xl shadow-xl shadow-primary-600/30 hover:shadow-primary-600/40 hover:-translate-y-1"
                >
                  Start Learning Free
                  <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
                <Link to="/login">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    onClick={triggerDemoConfetti}
                    className="h-16 px-12 text-xl bg-white/50 dark:bg-white/5 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-white/10"
                  >
                    View Demo
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features-section" className="py-32 bg-white dark:bg-dark-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 relative inline-block">
              Powerful Features for Effective Learning
              <motion.div 
                className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeInOut" }}
                style={{ originX: 0 }}
              />
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mt-6">
              A complete suite of tools designed to help you ace your exams with less stress.
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, i) => (
              <FeatureCard 
                key={i} 
                feature={feature} 
                index={i} 
                onLearnMore={() => smoothScrollTo('hero-section')} 
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <CTASection />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 border-t border-gray-800 relative overflow-hidden">
        {/* Background glow in footer */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-900/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md ring-1 ring-white/20">
                <BrainCircuit className="text-white w-6 h-6" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight">LearnFlow</span>
            </div>
            <p className="text-gray-400 max-w-xs text-center md:text-left">
              Empowering students with AI-driven learning tools for a smarter future.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="text-gray-400 text-sm">
              © 2025 LearnFlow AI. All rights reserved.
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-default">
              <span className="text-sm text-gray-300">Developed with</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
              <span className="text-sm text-gray-300">by</span>
              <span className="text-white font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">Divyansh</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
