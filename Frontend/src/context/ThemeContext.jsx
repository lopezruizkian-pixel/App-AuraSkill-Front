import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

const themes = {
  neon: "theme-neon",
  classic: "theme-classic"
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "neon";
  });

  useEffect(() => {
    document.body.classList.remove(...Object.values(themes));
    document.body.classList.add(themes[theme]);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
