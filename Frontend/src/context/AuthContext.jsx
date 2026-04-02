/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";

const TOKEN_KEY = "analytics_jwt";
const USER_KEY = "analytics_user";

const AuthContext = createContext(undefined);

const getStoredValue = (key, fallbackValue) => {
  const value = localStorage.getItem(key);

  if (!value) {
    return fallbackValue;
  }

  if (typeof fallbackValue !== "object" || fallbackValue === null) {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallbackValue;
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredValue(TOKEN_KEY, ""));
  const [user, setUser] = useState(() => getStoredValue(USER_KEY, null));

  const login = ({ token: nextToken, user: nextUser }) => {
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken("");
    setUser(null);
  };

  const contextValue = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      login,
      logout
    }),
    [token, user]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};