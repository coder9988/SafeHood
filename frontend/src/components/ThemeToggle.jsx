import { Moon, Sun } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => localStorage.theme === 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.theme = dark ? 'dark' : 'light';
  }, [dark]);

  return (
    <button className="rounded-lg border border-slate-300 p-2 dark:border-slate-700" onClick={() => setDark(!dark)} title="Toggle theme">
      {dark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}
