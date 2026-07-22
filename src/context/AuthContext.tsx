// context/AuthContext.tsx

import { apiGet } from "@/services/api";
import { logout as logoutService } from "@/services/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { Alert, Platform } from 'react-native';


const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: any) {

  const roleHierarchy = ["Read","Member", "Manager", "Admin"];

  const [loggedIn, setLoggedIn] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState<{displayName: string, name: string}>({displayName:"Read",name:"Read"});
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
      setRole(json.role)
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

  function logoutAlert()
  {
    if(loggedIn)
    {

      if(Platform.OS === 'web')
      {
        if (confirm("are you sure you one to logout") == true) {
          logout()
        } 
      }
      else
      {
        Alert.alert('logout', 'are you sure you one to logout', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Yes', onPress: () => logout()},
      
        ]);
      }
    }
  }

  function hasIRightRole(roleToHave:string):boolean
  {
    const requiredRoleIndex = roleHierarchy.indexOf(roleToHave);
    const userRoleIndex = roleHierarchy.indexOf(role.name);

    // Invalid roles
    if (requiredRoleIndex === -1 || userRoleIndex === -1) {
      return false;
    }
    // User can access the role if their role is equal or higher in hierarchy
    return userRoleIndex >= requiredRoleIndex;
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
        logoutAlert,
        hasIRightRole,
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


