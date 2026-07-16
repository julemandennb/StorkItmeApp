// context/AuthContext.tsx

import { apiGet } from "@/services/api";
import { logout as logoutService } from "@/services/auth";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: any) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [name, setName] = useState('');

  async function checkUser() {
    try {
      const json = await apiGet("/info");
      setLoggedIn(!!(json && json.userName));
      setName(json?.userName || '');
    } catch {
      setLoggedIn(false);
    }
  }

  async function loginSuccess() {
    await checkUser();
  }

  async function logout() {
    await logoutService();
    setLoggedIn(false);
    setName('');
  }

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        loggedIn,
        name,
        checkUser,
        loginSuccess,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be inside AuthProvider");
  }

  return context;
}