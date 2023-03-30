import axios from "axios";
import React, { useState, useEffect, createContext } from "react";

const AuthContext = createContext();

const AuthContextProvider = (props) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(false);

  const getLoggedIn = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      const response = await axios.get(
        `https://aqk0rsung8.execute-api.us-east-1.amazonaws.com/dev/isuserloggedin`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setLoggedIn(response.data.isLoggedIn === "true");
      if (response.data.isLoggedIn === "true") {
        setCurrentUser(response.data.user);
      }
    } else {
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
