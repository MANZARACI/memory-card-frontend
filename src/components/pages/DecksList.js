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
import { useToastContext } from "../../context/ToastContext";

const DecksList = () => {
  const [decks, setDecks] = useState(false);
  const [error, setError] = useState(false);

  const { ownerId } = useParams();

  const { loggedIn, currentUser } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  const addToast = useToastContext();

  const getDecksByOwnerId = async (id) => {
    try {
      const response = await axios.get(
        `https://aqk0rsung8.execute-api.us-east-1.amazonaws.com/dev/getdeckbyownerid/${id}`
      );
      setDecks(response.data);
    } catch (err) {
      addToast({ type: "error", message: "Failed to load decks" });
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
      await axios.delete(
        `https://aqk0rsung8.execute-api.us-east-1.amazonaws.com/dev/deletebyid/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await getDecksByOwnerId(ownerId);
      addToast({ type: "success", message: "Deleted deck" });
    } catch (err) {
      addToast({ type: "error", message: "Failed to delete deck" });
      console.log(err);
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
                deleteDeck(deck.deckID);
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
                  <b>{deck.Title.replace("%20", " ")}</b>
                </Card.Title>
                <Card.Text>Card count: {deck.Cards?.length || 0}</Card.Text>
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
                <Link to={`/deck/${deck.deckID}`}>
                  <Button className="w-100">Play</Button>
                </Link>
                {loggedIn && currentUser._id === ownerId && (
                  <Link to={`/deck/edit/${deck.deckID}`}>
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
