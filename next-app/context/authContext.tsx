'use client'
import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
    token: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    fetchWithAuth: (url: string, options: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const login = async (username: string, password: string) => {
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);

        const response = await fetch(`${process.env.NEXT_PUBLIC_HTTP_BACK}/auth/token`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params,
        });

        if (response.ok) {
            const data = await response.json();
            setToken(data.access_token);
            localStorage.setItem('token', data.access_token);
        } else {
            throw new Error('Login failed');
        }
    };

    const logout = async () => {
        const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_HTTP_BACK}/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        if (response.ok) {
            setToken(null);
            localStorage.removeItem('token');
            router.refresh();

        } else {
            throw new Error('Error logging out');
        }
    };

    const refreshAccessToken = async () => {
        const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_HTTP_BACK}/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
        });

        if (response.ok) {
            const data = await response.json();
            setToken(data.access_token);
            localStorage.setItem('token', data.access_token);
            return data.access_token;
        } else {
            throw new Error('Refresh token failed');
        }
    };

    const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
        const headers = {
            ...options.headers,
            Authorization: `Bearer ${token}`
        };

        const response = await fetch(url, { ...options, headers });

        if (response.status === 401) {
            const new_token: string = await refreshAccessToken();
            const newHeaders = {
                ...options.headers,
                Authorization: `Bearer ${new_token}`
            };
            return fetch(url, { ...options, headers: newHeaders });
        }

        return response;
    };

    return (
        <AuthContext.Provider value={{ token, login, logout, fetchWithAuth }}>
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
