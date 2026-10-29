import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored === 'dark' || stored === 'light') return stored;
      return 'dark'; // Dark mode default
    }
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="p-2 rounded-xl text-teal-800 dark:text-teal-200 hover:text-teal-600 dark:hover:text-teal-300 hover:bg-teal-100/60 dark:hover:bg-teal-900/40 transition-colors focus-visible:outline-2 focus-visible:outline-teal-500 cursor-pointer"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-teal-300" />
      ) : (
        <Moon className="w-4 h-4 text-teal-800" />
      )}
    </button>
  );
}
