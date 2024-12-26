import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(null);

  const navigate = useNavigate();

  useEffect(()=>{
     const storedUser = localStorage.getItem("authToken")
     const userData = localStorage.getItem("user")
     setUser(JSON.parse(storedUser))
     setUsers(JSON.parse(userData))
  },[])
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    setUsers(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, logout, setUser, users, setUsers }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
