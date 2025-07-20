import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing user in localStorage when the app loads
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error("Error checking authentication status:", error);
                localStorage.removeItem('user');
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    useEffect(() => {
        // Handle authentication errors (401) - logout user
        const handleAuthEvent = (event) => {
            const { type, message } = event.detail || {};

            if (type === 'auth-invalid' || type.includes('TOKEN')) {
                localStorage.removeItem('user');
                setUser(null);
            }
        };

        window.addEventListener('auth-event', handleAuthEvent);
        return () => {
            window.removeEventListener('auth-event', handleAuthEvent);
        };
    }, []);


    const updateUser = (userData) => {
        if (userData) {
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
        } else {
            localStorage.removeItem('user');
            setUser(null);
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    const isAuthenticated = !!user;
    const value = {
        user,
        setUser: updateUser,
        isAuthenticated,
        isLoading,
        logout
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext);