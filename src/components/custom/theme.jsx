import { Moon, Sun, Monitor, Check } from "@/utils";
import { useEffect, useState } from "react";
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui";

export function ThemeToggle({ variant = "box", className = "", children }) {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "system";
    });

    // Handle theme changes
    useEffect(() => {
        const root = document.documentElement;

        if (theme === "system") {
            const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            root.classList.toggle("dark", systemDark);
            localStorage.removeItem("theme");
        } else {
            root.classList.toggle("dark", theme === "dark");
            localStorage.setItem("theme", theme);
        }
    }, [theme]);

    // Listen for system preference changes
    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const handleSystemChange = (e) => {
            // Only apply system changes if theme is set to "system"
            if (theme === "system") {
                document.documentElement.classList.toggle("dark", e.matches);
            }
        };

        mediaQuery.addEventListener("change", handleSystemChange);
        return () => mediaQuery.removeEventListener("change", handleSystemChange);
    }, [theme]);

    const currentThemeIcon = {
        light: <Sun className="h-[1.2rem] w-[1.2rem]" />,
        dark: <Moon className="h-[1.2rem] w-[1.2rem]" />,
        system: <Monitor className="h-[1.2rem] w-[1.2rem]" />
    }[theme];

    const rowThemeIcon = {
        light: <Sun className="mr-2 h-4 w-4" />,
        dark: <Moon className="mr-2 h-4 w-4" />,
        system: <Monitor className="mr-2 h-4 w-4" />
    }[theme];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {variant === "row" ? (
                    <Button
                        variant="ghost"
                        className={`cursor-pointer w-full justify-start ${className}`}
                    >
                        {rowThemeIcon}
                        {children || "Theme"}
                    </Button>
                ) : (
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`cursor-pointer ${className}`}
                    >
                        {currentThemeIcon}
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem className='cursor-pointer' onClick={() => setTheme("light")}>
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                    {theme === "light" && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem className='cursor-pointer' onClick={() => setTheme("dark")}>
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                    {theme === "dark" && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem className='cursor-pointer' onClick={() => setTheme("system")}>
                    <Monitor className="mr-2 h-4 w-4" />
                    System
                    {theme === "system" && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}