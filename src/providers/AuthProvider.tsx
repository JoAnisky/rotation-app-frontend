import React from "react";
import { useContext, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { getCookie } from "@/utils/cookies";

interface Props {
  children: React.ReactNode;
}

const AuthProvider: React.FC<Props> = ({ children }) => {

  const token = getCookie('authToken');
  console.log(token);
  const [userName, setUserName] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [userId, setUserId] = useState<number | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(token ? token : null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);

  return (
    <AuthContext.Provider
      value={{ userName, setUserName, userRole, setUserRole, userId, setUserId, authToken, setAuthToken , isAuthenticated, setIsAuthenticated}}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
