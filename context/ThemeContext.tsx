import React, { createContext, useContext } from 'react';

export const Colors = {
    primary: '#4F46E5', // Indigo
    primaryLight: '#EEF2FF',
    secondary: '#8B5CF6', // Purple
    accent: '#14B8A6', // Teal
    background: '#F9FAFB',
    surface: '#FFFFFF',
    text: '#111827',
    textSecondary: '#6B7280',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    border: '#E5E7EB',
};

type ThemeContextType = {
    theme: 'light';
    colors: typeof Colors;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
    theme: 'light',
    colors: Colors,
    toggleTheme: () => { },
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <ThemeContext.Provider value={{ theme: 'light', colors: Colors, toggleTheme: () => { } }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
