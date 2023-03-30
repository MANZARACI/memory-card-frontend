import React, { useContext, useState } from "react";
import { Card, Form, Col, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { useToastContext } from "../../context/ToastContext";

const AddDeck = () => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  const navigate = useNavigate();
  const addToast = useToastContext();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://aqk0rsung8.execute-api.us-east-1.amazonaws.com/dev/adddeck",
        {
          title: title,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigate(`/deckList/${currentUser._id}`);
      addToast({ type: "success", message: "Created deck" });
    } catch (err) {
      addToast({ type: "error", message: "Failed to create deck" });
      if (err.response.data.errorMessage) {
        setError(err.response.data.errorMessage);
      }
    }
  };

  return (
    <Col xs={6} sm={5} md={4} lg={3} xl={2} className="mx-auto mt-5">
      {!!error && (
        <Alert variant="danger" onClose={() => setError(false)} dismissible>
          {error}
        </Alert>
      )}
      <Card>
        <Card.Body>
          <Form onSubmit={submitHandler}>
            <Form.Group>
              <Form.Label>Deck Title</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                maxLength={30}
              />
            </Form.Group>
            <Button
              type="submit"
              className="w-100 mt-4"
              disabled={title.length === 0}
            >
              Add
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default AddDeck;
