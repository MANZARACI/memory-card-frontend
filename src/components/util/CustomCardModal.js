import React, { useEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const CustomCardModal = (props) => {
  const [frontSide, setFrontSide] = useState("");
  const [backSide, setBackSide] = useState("");

  useEffect(() => {
    if (props.mode === "Edit") {
      setFrontSide(props.currentCard[0]);
      setBackSide(props.currentCard[1]);
    } else if (props.mode === "Add") {
      setFrontSide("");
      setBackSide("");
    }
  }, [props.mode, props.currentCard]);

  return (
    <Modal show={props.show} onHide={props.handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{props.mode}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          type="text"
          value={frontSide}
          onChange={(e) => setFrontSide(e.target.value)}
          placeholder="front side"
          maxLength={30}
        />
        <Form.Control
          className="mt-3"
          type="text"
          value={backSide}
          onChange={(e) => setBackSide(e.target.value)}
          placeholder="back side"
          maxLength={30}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          Close
        </Button>
        {props.mode === "Edit" && (
          <Button onClick={props.deleteHandler} variant="danger">
            Delete
          </Button>
        )}
        <Button
          variant="primary"
          onClick={() => props.modalFunction([frontSide, backSide])}
          disabled={frontSide.length === 0 || backSide.length === 0}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomCardModal;
