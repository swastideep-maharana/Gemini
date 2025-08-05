"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const toggle = () => {
    const newTheme = isDark ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  return (
    <button
      onClick={toggle}
      className="text-xs px-3 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      {isDark ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}
