import { createContext, useState, useEffect, useContext } from "react";

// 1. Create the Context
const ThemeContext = createContext();

// 2. Create a custom hook to use the context easily
export function useTheme() {
  return useContext(ThemeContext);
}

// 3. Create the Provider component
export function ThemeProvider({ children }) {
  // Check local storage first, default to "light"
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("taskflow_theme") || "light";
  });

  // Toggle function
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Apply the theme to the <body> tag so we can style it in CSS
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("taskflow_theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
