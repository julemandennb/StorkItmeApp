// context/AuthContext.tsx

import { apiGet } from "@/services/api";
import { logout as logoutService } from "@/services/auth";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: any) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userGroups, setUserGroups] = useState<{id: string, name: string,color: string}[]>([]);
  const [StorkItmeGroups, setStorkItmeGroups] = useState<{id: string, name: string,description: string}[]>([]);


  async function checkUser() {
    try {
      const json = await apiGet("/info");
      setLoggedIn(!!(json && json.userName));
      setName(json?.userName || '');
      setEmail(json?.email || '');
      setPhoneNumber(json?.phoneNumber || '');
      setUserGroups(json?.userGroups || []);
      setStorkItmeGroups(json?.storkItmeGroups || []);
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
    setEmail('');
    setPhoneNumber('');
    setUserGroups([]);
    setStorkItmeGroups([]);
  }

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        loggedIn,
        name,
        email,
        phoneNumber,
        userGroups,
        StorkItmeGroups,
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