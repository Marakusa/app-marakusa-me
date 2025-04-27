import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SessionProfileType, useApi } from './ApiContext';

interface SessionContextType {
    sessionCheck: boolean;
    setSession: (auth: string | null, token: string | null) => void;
    clearSession: () => void;
    profile: SessionProfileType;
    setProfile: (profile: SessionProfileType) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { api } = useApi();
    const [sessionCheck, setSessionState] = useState<boolean>(false);

    function checkSession() {
        const storedAuth = localStorage.getItem('auth');
        const storedToken = localStorage.getItem('token');

        const storedSession = storedAuth != "" && storedToken != "";
        setSessionState(storedSession);
    }

    useEffect(() => {
        checkSession();
    }, []);

    const setSession = (auth: string | null, token: string | null) => {
        if (auth && token) {
            localStorage.setItem("auth", auth || "");
            localStorage.setItem("token", token || "");
        } else {
            localStorage.removeItem("auth");
            localStorage.removeItem("token");
        }
        checkSession();
    };

    const clearSession = () => {
        const auth = localStorage.getItem("auth");
        const token = localStorage.getItem("token");
        if (!auth || !token) {
            api.signOutSession(auth, token, null)
                .then((response) => {
                    if (response.error) {
                        console.error(response.error);
                    }
                })
                .catch((error) => {
                    console.error("Error clearing session:", error);
                }
            );
        }
        setSession(null, null);
    };

    const [profile, setProfile] = useState<SessionProfileType>({ fetched: false, data: null });

    return (
        <SessionContext.Provider value={{ sessionCheck, setSession, clearSession, profile, setProfile }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = (): SessionContextType => {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
};
