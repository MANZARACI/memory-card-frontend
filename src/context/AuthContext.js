import axios from "axios";
import React, { useState, useEffect, createContext } from "react";

const AuthContext = createContext();

const AuthContextProvider = (props) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(false);

  const getLoggedIn = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      axios.defaults.headers.common["x-auth-token"] = token;
      const response = await axios.get("https://memory-card-backend.onrender.com/auth/loggedIn");

      setLoggedIn(response.data.isLoggedIn);
      if (response.data.isLoggedIn) {
        setCurrentUser(response.data.user);
      }
    } else {
      delete axios.defaults.headers.common["x-auth-token"];
      setLoggedIn(false);
      setCurrentUser(false);
    }
  };

  useEffect(() => {
    getLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, getLoggedIn, currentUser }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
export { AuthContextProvider };
