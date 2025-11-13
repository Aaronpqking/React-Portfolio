import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Determine if it's night time (6 PM - 6 AM)
const isNightTime = () => {
  const hour = new Date().getHours();
  return hour >= 18 || hour < 6;
};

// Get system preference
const getSystemPreference = () => {
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

// Resolve theme based on mode
const resolveTheme = (mode) => {
  if (mode === 'auto') {
    // Check system preference first, then time of day
    const systemPref = getSystemPreference();
    if (systemPref === 'dark') {
      return 'dark';
    }
    // If system prefers light, check time of day
    return isNightTime() ? 'dark' : 'light';
  }
  return mode;
};

export const ThemeProvider = ({ children }) => {

  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
        return savedTheme;
      }
    }
    return 'auto'; // Default to automatic
  });

  const [resolvedTheme, setResolvedTheme] = useState(() => {
    // Initialize resolved theme based on initial theme
    if (typeof window !== 'undefined') {
      const initialTheme = localStorage.getItem('theme') || 'auto';
      return resolveTheme(initialTheme);
    }
    return 'light';
  });

  // Update resolved theme
  useEffect(() => {
    const resolved = resolveTheme(theme);
    setResolvedTheme(resolved);
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', resolved);
    document.body.classList.toggle('dark-mode', resolved === 'dark');
  }, [theme]);

  // Listen for system preference changes and time-based updates
  useEffect(() => {
    if (theme === 'auto' && typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        const resolved = resolveTheme('auto');
        setResolvedTheme(resolved);
        document.documentElement.setAttribute('data-theme', resolved);
        document.body.classList.toggle('dark-mode', resolved === 'dark');
      };

      mediaQuery.addEventListener('change', handleChange);
      
      // Check time-based changes every minute
      const timeCheckInterval = setInterval(() => {
        const resolved = resolveTheme('auto');
        setResolvedTheme(prevResolved => {
          if (resolved !== prevResolved) {
            document.documentElement.setAttribute('data-theme', resolved);
            document.body.classList.toggle('dark-mode', resolved === 'dark');
            return resolved;
          }
          return prevResolved;
        });
      }, 60000); // Check every minute

      return () => {
        mediaQuery.removeEventListener('change', handleChange);
        clearInterval(timeCheckInterval);
      };
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'auto' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const setThemeMode = (mode) => {
    if (['light', 'dark', 'auto'].includes(mode)) {
      setTheme(mode);
      localStorage.setItem('theme', mode);
    }
  };

  const value = {
    theme,
    resolvedTheme,
    toggleTheme,
    setThemeMode,
    isDark: resolvedTheme === 'dark',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

