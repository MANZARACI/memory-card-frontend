import axios from "axios";
import React, { useState, useEffect, createContext } from "react";

const AuthContext = createContext();

const AuthContextProvider = (props) => {
  const [loggedIn, setLoggedIn] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);

  const getLoggedIn = async () => {
    //const loggedInRes = await axios.get("http://localhost:5000/auth/loggedIn");
    const loggedInRes = await axios.get(
      "https://memory-card-backend.herokuapp.com/auth/loggedIn"
    );
    setLoggedIn(loggedInRes.data.isLoggedIn);
    if (loggedInRes.data.isLoggedIn) {
      setCurrentUser(loggedInRes.data.user);
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
