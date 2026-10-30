import { useState } from "react";

export type Theme = "light" | "dark";

// מצב כהה / בהיר.
// ההגדרה הראשונית נקבעת כבר ב-index.html (לפני שהדף מוצג), וכאן רק קוראים אותה ומחליפים.
export function useTheme() {
    const [theme, setTheme] = useState<Theme>(() =>
        document.documentElement.classList.contains("dark") ? "dark" : "light"
    );

    function toggleTheme() {
        const next: Theme = theme === "dark" ? "light" : "dark";
        document.documentElement.classList.toggle("dark", next === "dark");
        try {
            localStorage.setItem("theme", next);
        } catch {
            // דפדפן שחוסם שמירה - המצב יישאר רק עד רענון
        }
        setTheme(next);
    }

    return { theme, toggleTheme };
}
