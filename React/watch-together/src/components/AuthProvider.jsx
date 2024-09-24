import axiosInstance from "./axiosInstance";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { setTokenFunction } from "./axiosInstance";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  // State to hold the authentication token
  const [token, setToken_] = useState(localStorage.getItem("token"));

  // Function to set the authentication token
  const setToken = (newToken) => {
    setToken_(newToken);
  };

  useEffect(() => {
    if (token) {
      axiosInstance.defaults.headers.common["Authorization"] = "Bearer " + token;
      localStorage.setItem('token',token);
      console.log('Setted access token');
    } else {
      delete axiosInstance.defaults.headers.common["Authorization"];
      localStorage.removeItem('token')
    }
  }, [token]);

  const contextValue = useMemo(
    () => ({
      token,
      setToken,
    }),
    [token]
  );

  setTokenFunction(setToken);

  // Provide the authentication context to the children components
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;