import React, { useEffect } from "react";
import { useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";

interface Props {
  children: React.ReactNode;
}

const AuthProvider: React.FC<Props> = ({ children }) => {


  const [userName, setUserName] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [userId, setUserId] = useState<number | null>(null);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!csrfToken);

  useEffect(() => {
    const storedCsrfToken = localStorage.getItem('csrfToken');

    if (storedCsrfToken) {
      setCsrfToken(storedCsrfToken);
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ userName, setUserName, userRole, setUserRole, userId, setUserId, csrfToken, setCsrfToken , isAuthenticated, setIsAuthenticated}}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;