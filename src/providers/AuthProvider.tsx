import { AuthContext } from "@/contexts/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import React from "react";

interface Props {
    children : React.ReactNode;
}

export const AuthProvider : React.FC<Props> = ({children}) => {
    const { user, login, logout, setUser } = useAuth();
    return (
        <AuthContext.Provider value={{user, setUser}}>
            {children}
        </AuthContext.Provider>
    )
}