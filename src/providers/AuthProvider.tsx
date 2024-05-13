import { useContext, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import React from "react";
import { User } from "@/types/userInterface";

interface Props {
  children: React.ReactNode;
}

const AuthProvider: React.FC<Props> = ({ children }) => {
  const storedToken = localStorage.getItem("token");
  const initialAuthToken: User | null = storedToken ? JSON.parse(storedToken) : null;

  const [userName, setUserName] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [userId, setUserId] = useState<number | null>(null);
  const [authToken, setAuthToken] = useState<User | null>(initialAuthToken);

  return (
    <AuthContext.Provider
      value={{ userName, setUserName, userRole, setUserRole, userId, setUserId, authToken, setAuthToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
