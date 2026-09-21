import React, { createContext, useContext, useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    role: string;
    is_subscribed?: boolean;
}

interface AuthContextType {
    user: User | null;
    login: (user: User, token?: string) => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
    isAdmin: boolean;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('user');
        const token = localStorage.getItem('access_token');
        if (savedUser && token) {
            try {
                return JSON.parse(savedUser);
            } catch (e) {
                console.error("Failed to parse saved user", e);
                return null;
            }
        }
        return null;
    });

    const login = (newUser: User, token?: string) => {
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        if (token) {
            localStorage.setItem('access_token', token);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
    };

    const refreshUser = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) return;
        try {
            const module = await import('../api');
            const ApiClient = module.default;
            const api = new ApiClient();
            const response = await api.getUser();
            if (response.success && response.user) {
                setUser(response.user);
                localStorage.setItem('user', JSON.stringify(response.user));
            }
        } catch (error) {
            console.error("Failed to refresh user", error);
        }
    };

    const isAdmin = user?.role === 'admin';
    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ user, login, logout, refreshUser, isAdmin, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
