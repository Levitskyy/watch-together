import axiosInstance from "./axiosInstance";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { setTokenFunction } from "./axiosInstance";
import { serverURL } from "../App";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  // State to hold the authentication token
  const [token, setToken_] = useState(localStorage.getItem("token"));
  const [isAuthenticated, setIsAuthenticated_] = useState(false);

  // Function to set the authentication token
  const setToken = (newToken) => {
    setToken_(newToken);
  };

  const setIsAuthenticated = (newAuth) => {
    setIsAuthenticated_(newAuth);
  };

  const logout = async () => {
    try {
      const response = await axiosInstance.post(`http://${serverURL}/api/auth/logout`);
      if (response.status !== 200) {
        console.error('Error logging out');
        return false;
      }
      else {
        setToken_();
        return true;
      }
    } catch (error) {
      console.error('Error logging out:', error);
      return false;
    }
  };

  useEffect(() =>  {
    const initConnect = async () => {
      const token = localStorage.getItem('token');
      const authStatus = !!token;
      if (!authStatus) {
        try {
          const response = await axiosInstance.post(`http://${serverURL}/api/auth/refresh`, {}, {
            withCredentials: true,
          });
          if (response.status === 200) {
            setToken(response.data.access_token);
          }
          else {
            setIsAuthenticated(authStatus);
          }
        } catch (error) {
          console.error('Error refreshing access token: ', error);
        }
      }

      setIsAuthenticated(authStatus);
    }
    initConnect();
  }, []);

  useEffect(() => {
    if (token) {
      axiosInstance.defaults.headers.common["Authorization"] = "Bearer " + token;
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
    } else {
      delete axiosInstance.defaults.headers.common["Authorization"];
      localStorage.removeItem('token')
      setIsAuthenticated(false);
    }
  }, [token]);

  const contextValue = useMemo(
    () => ({
      token,
      setToken,
      isAuthenticated,
      setIsAuthenticated,
      logout,
    }),
    [token, isAuthenticated]
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