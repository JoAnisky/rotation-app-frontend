import { createContext } from "react";

interface AuthContext {
    userName: string | null;
    userRole: string | null;
    userId: number | null;
    authToken: string |  null;
    isAuthenticated: boolean;
    setAuthToken: (token: string | null) => void;
    setUserName: (name: string) => void;
    setUserRole: (role: string) => void;
    setUserId: (id: number | null) => void;
    setIsAuthenticated: (authenticated: boolean) => void;
}

export const AuthContext = createContext<AuthContext>({
    userName: null,
    userRole:  null,
    userId: null,
    authToken: null,
    isAuthenticated: false,
    setAuthToken: () => {},
    setUserName: () => {},
    setUserRole: () => {},
    setUserId: () => {},
    setIsAuthenticated: () => {}
})