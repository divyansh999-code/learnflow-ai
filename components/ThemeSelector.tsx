import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/store';
import { ThemeColor } from '../types/types';
import { Palette } from 'lucide-react';
import { clsx } from 'clsx';

const THEMES: Record<ThemeColor, string> = {
  indigo: '99 102 241',
  blue: '59 130 246',
  purple: '168 85 247',
  rose: '244 63 94',
  orange: '249 115 22',
  teal: '20 184 166',
};

const THEME_LABELS: Record<ThemeColor, string> = {
  indigo: 'Indigo',
  blue: 'Blue',
  purple: 'Purple',
  rose: 'Rose',
  orange: 'Orange',
  teal: 'Teal',
};

// RGB values for each theme shade (50 to 900)
// Simplified for this implementation to mapping just the primary hues.
// In a real app, you would map all shades. Here we focus on the primary accent change.
const THEME_VARIABLES: Record<ThemeColor, Record<string, string>> = {
  indigo: {
    '50': '238 242 255', '100': '224 231 255', '500': '99 102 241', '600': '79 70 229', '700': '67 56 202', '900': '49 46 129'
  },
  blue: {
    '50': '239 246 255', '100': '219 234 254', '500': '59 130 246', '600': '37 99 235', '700': '29 78 216', '900': '30 58 138'
  },
  purple: {
    '50': '250 245 255', '100': '243 232 255', '500': '168 85 247', '600': '147 51 234', '700': '126 34 206', '900': '88 28 135'
  },
  rose: {
    '50': '255 241 242', '100': '255 228 230', '500': '244 63 94', '600': '225 29 72', '700': '190 18 60', '900': '136 19 55'
  },
  orange: {
    '50': '255 247 237', '100': '255 237 213', '500': '249 115 22', '600': '234 88 12', '700': '194 65 12', '900': '124 45 18'
  },
  teal: {
    '50': '240 253 250', '100': '204 251 241', '500': '20 184 166', '600': '13 148 136', '700': '15 118 110', '900': '19 78 74'
  }
};

export const ThemeSelector = () => {
  const { themeColor, setThemeColor } = useStore();
  const [ripple, setRipple] = useState<{ x: number, y: number, color: ThemeColor } | null>(null);

  // Apply theme variables to root
  useEffect(() => {
    const root = document.documentElement;
    const colors = THEME_VARIABLES[themeColor];
    if (colors) {
      Object.entries(colors).forEach(([shade, value]) => {
        root.style.setProperty(`--color-primary-${shade}`, value as string);
      });
    }
  }, [themeColor]);

  const handleThemeChange = (color: ThemeColor, e: React.MouseEvent) => {
    if (themeColor === color) return;

    // Start ripple at click coordinates
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    setRipple({ x, y, color });

    // Delay actual theme switch slightly to allow ripple to start filling
    setTimeout(() => {
      setThemeColor(color);
    }, 400);

    // Clear ripple after animation
    setTimeout(() => {
      setRipple(null);
    }, 1000);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Ripple Element */}
      <AnimatePresence>
        {ripple && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 50 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{
              position: 'fixed',
              top: ripple.y,
              left: ripple.x,
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: `rgb(${THEME_VARIABLES[ripple.color]['500']})`,
              zIndex: 9999,
              pointerEvents: 'none',
              transform: 'translate(-50%, -50%)',
            }}
          />
        )}
      </AnimatePresence>

      <div className="p-1.5 bg-gray-100 dark:bg-dark-700/50 rounded-full flex items-center gap-1.5 border border-gray-200 dark:border-dark-600">
        {(Object.keys(THEMES) as ThemeColor[]).map((color) => (
          <div key={color} className="relative group">
            <button
              onClick={(e) => handleThemeChange(color, e)}
              className={clsx(
                "w-6 h-6 rounded-full transition-transform duration-200 border-2",
                themeColor === color ? "scale-110 border-gray-400 dark:border-white shadow-sm" : "border-transparent hover:scale-125"
              )}
              style={{ backgroundColor: `rgb(${THEME_VARIABLES[color]['500']})` }}
              aria-label={`Select ${THEME_LABELS[color]} theme`}
            />
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              {THEME_LABELS[color]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
