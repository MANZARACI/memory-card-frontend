import React from "react";
import Router from "./Router";
import { AuthContextProvider } from "./context/AuthContext";
import { ToastContextProvider } from "./context/ToastContext";

function App() {
  return (
    <AuthContextProvider>
      <ToastContextProvider>
        <Router />
      </ToastContextProvider>
    </AuthContextProvider>
  );
}

export default App;
