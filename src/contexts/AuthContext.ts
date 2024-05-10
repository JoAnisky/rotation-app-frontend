import { createContext } from "react";
import { User } from "@/types/userInterface";

interface AuthContext {
    user: User | null;
    setUser: (user: User | null) => void
}

export const AuthContext = createContext<AuthContext>({
    user: null,
    setUser: () => {}
})