import React, { useContext } from "react";
import { Card, Col } from "react-bootstrap";
import background from "../../images/background.webp";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

const Home = () => {
  const { loggedIn } = useContext(AuthContext);

  return (
    <Col xs={10} sm={7} md={6} lg={5} xl={4} className="mx-auto mt-5">
      <Card>
        <Card.Header
          className="my-1"
          style={{ textAlign: "center", fontSize: "1.3rem" }}
        >
          <b>Memory Card App</b>
        </Card.Header>
        <Card.Img src={background} />
        <Card.Body
          className="mt-3"
          style={{ fontWeight: "600", fontSize: "1.1rem" }}
        >
          <Card.Title>The Simplest Flashcard App</Card.Title>
          <Card.Text>
            - Create up to 10 decks <br />- Share your decks' links with others
            <br />- Easy to create, easy to use
            <br />- Simple UI
          </Card.Text>
          {!loggedIn && (
            <Card.Text className="mt-4">
              Click <Link to="/login">Login</Link> to start creating <br />
              If you are not already registered, click{" "}
              <Link to="/register">Register</Link>
            </Card.Text>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
};

export default Home;
