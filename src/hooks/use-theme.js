import { useEffect, useState } from "react";

export function useTheme() {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window === 'undefined') return false;

        return document.documentElement.classList.contains("dark");
    });

    useEffect(() => {
        const isDark = document.documentElement.classList.contains("dark");
        setIsDarkMode(isDark);

        const observer = new MutationObserver(() => {
            const isDark = document.documentElement.classList.contains("dark");
            setIsDarkMode(isDark);
        });

        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
        return () => observer.disconnect();
    }, []);

    return { isDarkMode };
}