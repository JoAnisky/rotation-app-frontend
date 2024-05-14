import { createContext } from "react";

interface AuthContext {
    userName: string | null;
    userRole: string | null;
    userId: number | null;
    authToken: string |  null;
    //setUser: (user: User | null) => void;
    setAuthToken: (token: string | null) => void;
    setUserName: (name: string) => void;
    setUserRole: (role: string) => void;
    setUserId: (id: number | null) => void;
}

export const AuthContext = createContext<AuthContext>({
    userName: null,
    userRole:  null,
    userId: null,
    authToken: null,
    setAuthToken: () => {},
    setUserName: () => {},
    setUserRole: () => {},
    setUserId: () => {},
})