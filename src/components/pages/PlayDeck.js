import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Col, Card, Row, Button, Stack, Form, Alert } from "react-bootstrap";
import { useToastContext } from "../../context/ToastContext";

const PlayDeck = () => {
  const [currentDeck, setCurrentDeck] = useState(false);
  const [error, setError] = useState(false);
  const [shownCard, setShownCard] = useState(1);
  const [shownSide, setShownSide] = useState(0); // 0 for front, 1 for back
  const [numInput, setNumInput] = useState(1);
  const addToast = useToastContext();

  const { deckId } = useParams();

  const getDeckInfo = async (id) => {
    try {
      const response = await axios.get(
        `https://aqk0rsung8.execute-api.us-east-1.amazonaws.com/dev/getdeckbyid/${id}`
      );

      setCurrentDeck({
        Title: response.data.Title.replace("%20", " "),
        deckID: response.data.deckID,
        userid: response.data.userid,
        cards: response.data.Cards || [],
      });
    } catch (err) {
      addToast({ type: "error", message: "Failed to load deck info" });
      if (err.response.data.errorMessage) {
        setError(err.response.data.errorMessage);
      }
    }
  };

  useEffect(() => {
    getDeckInfo(deckId);
  }, [deckId]);

  const cardFlipper = () => {
    if (shownSide) {
      setShownSide(0);
    } else {
      setShownSide(1);
    }
  };

  const shownCardChanger = (e) => {
    setNumInput(e.target.value);

    if (e.target.value >= 1 && e.target.value <= currentDeck.cards.length) {
      setShownCard(e.target.value);
    }
  };

  let content;

  if (currentDeck) {
    content = (
      <>
        <Row>
          <Card>
            <Card.Body>
              <Card.Title>
                <b>{currentDeck.Title}</b>
              </Card.Title>
              <Card.Text>
                Card count: {currentDeck.cards?.length || 0}
              </Card.Text>
            </Card.Body>
          </Card>
        </Row>
        <Row className="mt-4">
          {!!currentDeck.cards?.length ? (
            <>
              {" "}
              <Card style={{ height: "18rem" }}>
                <Card.Body>
                  <h1 style={{ textAlign: "center", paddingTop: "4rem" }}>
                    {currentDeck.cards[shownCard - 1][shownSide]}
                  </h1>
                </Card.Body>
                <Button
                  onClick={cardFlipper}
                  variant="success"
                  className="mb-3 w-50 mx-auto"
                >
                  Flip
                </Button>
              </Card>
              <Stack
                gap={2}
                direction="horizontal"
                className="w-50 mx-auto mt-4"
              >
                <Button
                  onClick={() => {
                    if (shownCard - 1 >= 1) {
                      setNumInput(shownCard - 1);
                      setShownCard((prev) => prev - 1);
                    }
                  }}
                >
                  &lt;
                </Button>
                <Form.Control
                  type="number"
                  max={currentDeck.cards?.length}
                  min={1}
                  value={numInput}
                  onChange={shownCardChanger}
                />
                <Button
                  onClick={() => {
                    if (shownCard + 1 <= currentDeck.cards?.length) {
                      setNumInput(shownCard + 1);
                      setShownCard((prev) => prev + 1);
                    }
                  }}
                >
                  &gt;
                </Button>
              </Stack>
            </>
          ) : (
            <h3>There is no card in this deck.</h3>
          )}
        </Row>
      </>
    );
  }

  return (
    <Col xs={10} sm={6} md={5} lg={4} xl={3} className="mx-auto mt-5">
      {!!error && (
        <Alert variant="danger" onClose={() => setError(false)} dismissible>
          {error}
        </Alert>
      )}
      {content}
    </Col>
  );
};

export default PlayDeck;
