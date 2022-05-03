import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  Row,
  Col,
  Card,
  Button,
  Alert,
  Popover,
  OverlayTrigger,
} from "react-bootstrap";
import AuthContext from "../../context/AuthContext";

const DecksList = () => {
  const [decks, setDecks] = useState(false);
  const [error, setError] = useState(false);

  const { ownerId } = useParams();

  const { loggedIn, currentUser } = useContext(AuthContext);

  const getDecksByOwnerId = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/deck/user/${id}`);
      setDecks(response.data);
    } catch (err) {
      if (err.response.data.errorMessage) {
        setError(err.response.data.errorMessage);
      }
    }
  };

  useEffect(() => {
    getDecksByOwnerId(ownerId);
  }, [ownerId]);

  const deleteDeck = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/deck/${id}`);
      await getDecksByOwnerId(ownerId);
    } catch (err) {
      if (err.response.data.errorMessage) {
        setError(err.response.data.errorMessage);
      }
    }
  };

  let list;

  if (decks) {
    list = decks.map((deck, i) => {
      const popover = (
        <Popover>
          <Popover.Header as="h3">Are you sure?</Popover.Header>
          <Popover.Body>
            <Button
              onClick={() => {
                deleteDeck(deck._id);
                document.body.click();
              }}
              variant="danger"
              className="w-100"
            >
              Yes
            </Button>
          </Popover.Body>
        </Popover>
      );

      return (
        <Card key={i} className="mt-3">
          <Row>
            <Col xs={8}>
              <Card.Body>
                <Card.Title>
                  <b>{deck.title}</b>
                </Card.Title>
                <Card.Text>Card count: {deck.cards.length}</Card.Text>
                {loggedIn && currentUser._id === ownerId && (
                  <OverlayTrigger
                    trigger="click"
                    placement="top-start"
                    overlay={popover}
                    rootClose={true}
                  >
                    <Button variant="danger">Delete</Button>
                  </OverlayTrigger>
                )}
              </Card.Body>
            </Col>
            <Col xs={3} className="px-0">
              <Card.Body className="px-0">
                <Link to={`/deck/${deck._id}`}>
                  <Button className="w-100">Play</Button>
                </Link>
                {loggedIn && currentUser._id === ownerId && (
                  <Link to={`/deck/edit/${deck._id}`}>
                    <Button variant="secondary" className="w-100 mt-1">
                      Edit
                    </Button>
                  </Link>
                )}
              </Card.Body>
            </Col>
          </Row>
        </Card>
      );
    });
  }

  return (
    <>
      <Col xs={7} sm={6} md={5} lg={4} xl={3} className="mx-auto mt-5">
        {!!error && (
          <Alert variant="danger" onClose={() => setError(false)} dismissible>
            {error}
          </Alert>
        )}
        <div
          style={{
            maxHeight: "40rem",
            paddingRight: "11px",
            overflowY: "scroll",
          }}
        >
          {list}
        </div>
        {loggedIn && currentUser._id === ownerId && (
          <div className="w-50 mx-auto mt-4">
            <Link to="/deck/new">
              <Button className="w-100">New Deck</Button>
            </Link>
          </div>
        )}
      </Col>
    </>
  );
};

export default DecksList;
