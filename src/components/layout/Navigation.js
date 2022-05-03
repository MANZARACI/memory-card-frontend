import axios from "axios";
import React, { useContext } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

const Navigation = () => {
  const { loggedIn, getLoggedIn, currentUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const logoutHandler = async () => {
    //await axios.get("http://localhost:5000/auth/logout");
    await axios.get("https://memory-card-backend.herokuapp.com/auth/logout");
    await getLoggedIn();
    navigate("/");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Link className="navbar-brand" to="/">
          Memory Card
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {loggedIn === false && (
              <>
                <Link className="nav-link" to="/login">
                  Login
                </Link>
                <Link className="nav-link" to="/register">
                  Register
                </Link>
              </>
            )}
            {loggedIn === true && (
              <>
                <Link className="nav-link" to={`/decklist/${currentUser._id}`}>
                  My Decks
                </Link>
                <Link className="nav-link" to={`/account`}>
                  Account
                </Link>
                <Link onClick={logoutHandler} className="nav-link" to="#">
                  Log out
                </Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
