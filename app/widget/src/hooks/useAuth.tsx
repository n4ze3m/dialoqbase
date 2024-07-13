import React, { createContext, useContext, useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { getBotPublicId } from "../utils/getUrl";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, rememberFor7Days: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const publicId = getBotPublicId();
  const tokenId = `db_bot_token_${publicId}`;
  const [cookies, setCookie, removeCookie] = useCookies([tokenId]);
  const [token, setToken] = useState<string | null>(cookies[tokenId] || null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!cookies[tokenId]
  );

  const login = (newToken: string, rememberFor7Days: boolean) => {
    const expirationDate = rememberFor7Days
      ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      : undefined;
    setCookie(tokenId, newToken, { expires: expirationDate });
    setToken(newToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    removeCookie(tokenId);
    setToken(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const storedToken = cookies.db_bot_token;
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, [cookies.db_bot_token]);

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
