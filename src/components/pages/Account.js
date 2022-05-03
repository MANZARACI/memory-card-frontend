import React, { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { Card, Col, Form, Row, Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Account = () => {
  const { getLoggedIn, currentUser } = useContext(AuthContext);

  const [firstName, setFirstName] = useState(currentUser.firstName);
  const [lastName, setLastName] = useState(currentUser.lastName);
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  const logoutHandler = async () => {
    localStorage.removeItem("token");
    await getLoggedIn();
    navigate("/login");
  };

  const editAccountInfo = async () => {
    try {
      await axios.patch("https://memory-card-backend.herokuapp.com/auth/edit", {
        firstName,
        lastName,
      });
      await logoutHandler();
    } catch (err) {
      if (err.response.data.errorMessage) {
        setError(err.response.data.errorMessage);
      }
    }
  };

  return (
    <Col xs={9} sm={8} md={5} lg={4} xl={3} className="mx-auto mt-5">
      {!!error && (
        <Alert variant="danger" onClose={() => setError(false)} dismissible>
          {error}
        </Alert>
      )}
      <Card>
        <Card.Header>
          <h3>My Account</h3>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col xs={5}>
              <h5>First Name</h5>
            </Col>
            <Col xs={7}>
              <Form.Control
                type="text"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
                maxLength={20}
              />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col xs={5}>
              <h5>Last Name</h5>
            </Col>
            <Col xs={7}>
              <Form.Control
                type="text"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
                maxLength={20}
              />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col xs={5}>
              <h5>Email</h5>
            </Col>
            <Col xs={7}>
              <p>{currentUser.email}</p>
            </Col>
          </Row>
          <Row className="mt-3">
            <Button
              className="w-25 ms-auto me-3"
              onClick={editAccountInfo}
              disabled={!firstName.length || !lastName.length}
            >
              Save
            </Button>
          </Row>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default Account;
