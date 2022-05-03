import React, { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/layout/Navigation";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import AuthContext from "./context/AuthContext";
import DecksList from "./components/pages/DecksList";
import AddDeck from "./components/pages/AddDeck";
import EditDeck from "./components/pages/EditDeck";
import PlayDeck from "./components/pages/PlayDeck";
import Account from "./components/pages/Account";
import Home from "./components/pages/Home";

const Router = () => {
  const { loggedIn } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        {loggedIn === false && (
          <>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </>
        )}
        <Route path="/deckList/:ownerId" element={<DecksList />} />
        <Route path="/deck/:deckId" element={<PlayDeck />} />
        {loggedIn === true && (
          <>
            <Route path="/deck/new" element={<AddDeck />} />
            <Route path="/deck/edit/:deckId" element={<EditDeck />} />
            <Route path="/account" element={<Account />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
