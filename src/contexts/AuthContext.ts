import { createContext } from "react";

interface AuthContext {
    userName: string | null;
    userRole: string | null;
    userId: number | null;
    csrfToken: string |  null;
    isAuthenticated: boolean;
    setCsrfToken: (csrfToken: string | null) => void;
    setUserName: (name: string) => void;
    setUserRole: (role: string) => void;
    setUserId: (id: number | null) => void;
    setIsAuthenticated: (authenticated: boolean) => void;
}

export const AuthContext = createContext<AuthContext>({
    userName: null,
    userRole:  null,
    userId: null,
    csrfToken: null,
    isAuthenticated: false,
    setCsrfToken: () => {},
    setUserName: () => {},
    setUserRole: () => {},
    setUserId: () => {},
    setIsAuthenticated: () => {}
})