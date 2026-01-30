import { setAuthToken } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
    id: number;
    email: string;
    name: string;
    university: string;
    major: string;
    year: string;
    isPremium: boolean;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (userData: User, token: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStorageData();
    }, []);

    const loadStorageData = async () => {
        try {
            const authDataSerialized = await AsyncStorage.getItem('@AuthData');
            if (authDataSerialized) {
                const authData = JSON.parse(authDataSerialized);
                setUser(authData.user);
                if (authData.token) {
                    setAuthToken(authData.token);
                }
            }
        } catch (error) {
            console.error('Error loading auth data:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (userData: User, token: string) => {
        try {
            setUser(userData);
            setAuthToken(token);
            await AsyncStorage.setItem('@AuthData', JSON.stringify({ user: userData, token }));
        } catch (error) {
            console.error('Error saving login data:', error);
        }
    };

    const logout = async () => {
        try {
            setUser(null);
            setAuthToken('');
            await AsyncStorage.removeItem('@AuthData');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const updateUser = async (updatedFields: Partial<User>) => {
        if (!user) return;
        try {
            const newUser = { ...user, ...updatedFields };
            setUser(newUser);
            const authDataSerialized = await AsyncStorage.getItem('@AuthData');
            if (authDataSerialized) {
                const authData = JSON.parse(authDataSerialized);
                await AsyncStorage.setItem('@AuthData', JSON.stringify({ ...authData, user: newUser }));
            }
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
