import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Alert,
  Col,
  Row,
  Card,
  Button,
  Stack,
  Form,
  Popover,
  OverlayTrigger,
} from "react-bootstrap";
import AuthContext from "../../context/AuthContext";
import CustomCardModal from "../util/CustomCardModal";

const EditDeck = () => {
  const [currentDeck, setCurrentDeck] = useState(false);
  const [error, setError] = useState(false);
  const [shownCard, setShownCard] = useState(1);
  const [shownSide, setShownSide] = useState(0); // 0 for front, 1 for back
  const [numInput, setNumInput] = useState(1);
  const [modalMode, setModalMode] = useState("");
  const [newTitle, setNewTitle] = useState("");

  const { deckId } = useParams();

  const { currentUser } = useContext(AuthContext);

  const getDeckInfo = async (id) => {
    try {
      const response = await axios.get(
        `https://memory-card-backend.onrender.com/deck/${id}`
      );
      setCurrentDeck(response.data);
    } catch (err) {
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

  const addCard = async (card) => {
    try {
      await axios.patch(
        `https://memory-card-backend.onrender.com/deck/${deckId}`,
        { card: card }
      );
      await getDeckInfo(deckId);
      setModalMode("");
    } catch (err) {
      if (err.response.data.errorMessage) {
        setError(err.response.data.errorMessage);
      }
      setModalMode("");
    }
  };

  const updateCard = async (card) => {
    try {
      await axios.patch(
        `https://memory-card-backend.onrender.com/deck/${deckId}/${
          shownCard - 1
        }`,
        { card: card }
      );
      await getDeckInfo(deckId);
      setModalMode("");
    } catch (err) {
      if (err.response.data.errorMessage) {
        setError(err.response.data.errorMessage);
      }
      setModalMode("");
    }
  };

  const deleteCard = async () => {
    try {
      await axios.delete(
        `https://memory-card-backend.onrender.com/deck/${deckId}/${
          shownCard - 1
        }`
      );
      await getDeckInfo(deckId);
      if (shownCard !== 1) {
        setShownCard((prev) => prev - 1);
        setNumInput(shownCard - 1);
      }
      setModalMode("");
    } catch (err) {
      if (err.response.data.errorMessage) {
        setError(err.response.data.errorMessage);
      }
      setModalMode("");
    }
  };

  const updateTitle = async () => {
    try {
      await axios.patch(
        `https://memory-card-backend.onrender.com/deck/${deckId}/title`,
        { newTitle: newTitle }
      );
      await getDeckInfo(deckId);
      document.body.click();
    } catch (err) {
      if (err.response.data.errorMessage) {
        setError(err.response.data.errorMessage);
      }
    }
  };

  const editCardHandler = () => {
    setModalMode("Edit");
  };

  const addCardHandler = () => {
    setModalMode("Add");
  };

  const popover = (
    <Popover>
      <Popover.Header as="h3">New Title</Popover.Header>
      <Popover.Body>
        <Stack gap={3} direction="horizontal">
          <Form.Control
            className="w-100"
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            maxLength={30}
          />
          <Button onClick={() => updateTitle()} className="w-50">
            Save
          </Button>
        </Stack>
      </Popover.Body>
    </Popover>
  );

  let content;

  if (currentDeck && currentDeck.owner === currentUser._id) {
    content = (
      <>
        <Row>
          <Card>
            <Row>
              <Col xs={7}>
                <Card.Body>
                  <Card.Title>
                    <b>{currentDeck.title}</b>
                  </Card.Title>
                  <Card.Text>Card count: {currentDeck.cards.length}</Card.Text>
                </Card.Body>
              </Col>
              <Col xs={4} className="px-0">
                <Card.Body className="px-0">
                  <OverlayTrigger
                    trigger="click"
                    placement="bottom"
                    overlay={popover}
                    rootClose={true}
                  >
                    <Button onClick={() => setNewTitle("")} className="w-100">
                      Change Title
                    </Button>
                  </OverlayTrigger>
                  <Button
                    onClick={addCardHandler}
                    variant="secondary"
                    className="w-100 mt-1"
                  >
                    Add a Card
                  </Button>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </Row>
        <Row className="mt-4">
          {!!currentDeck.cards.length ? (
            <>
              <Card style={{ height: "18rem" }}>
                <Card.Body>
                  <h1 style={{ textAlign: "center", paddingTop: "4rem" }}>
                    {currentDeck.cards[shownCard - 1][shownSide]}
                  </h1>
                </Card.Body>
                <Stack direction="horizontal" className="mb-3">
                  <Button
                    onClick={editCardHandler}
                    variant="info"
                    className="w-25"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={cardFlipper}
                    variant="success"
                    className="w-25 ms-auto"
                  >
                    Flip
                  </Button>
                </Stack>
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
                  max={currentDeck.cards.length}
                  min={1}
                  value={numInput}
                  onChange={shownCardChanger}
                />
                <Button
                  onClick={() => {
                    if (shownCard + 1 <= currentDeck.cards.length) {
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
    <>
      {modalMode && (
        <CustomCardModal
          show={!!modalMode}
          mode={modalMode}
          handleClose={() => setModalMode("")}
          currentCard={currentDeck.cards[shownCard - 1]}
          deleteHandler={deleteCard}
          modalFunction={modalMode === "Edit" ? updateCard : addCard}
        />
      )}
      <Col xs={10} sm={6} md={5} lg={4} xl={3} className="mx-auto mt-5">
        {!!error && (
          <Alert variant="danger" onClose={() => setError(false)} dismissible>
            {error}
          </Alert>
        )}
        {content}
      </Col>
    </>
  );
};

export default EditDeck;
