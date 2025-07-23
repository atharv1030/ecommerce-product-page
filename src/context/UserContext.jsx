// src/context/UserContext.js
import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("nexusUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("nexusUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("nexusUser");
      localStorage.removeItem("token");
    }
  }, [user]);

  const login = (userInfo) => setUser(userInfo);
  const logout = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
