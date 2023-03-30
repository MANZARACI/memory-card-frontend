import React, { useContext, useState } from "react";
import { Form, Col, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import classess from "./Auth.module.css";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import { useToastContext } from "../../context/ToastContext";

const Register = () => {
  const [error, setError] = useState(false);

  const { getLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const addToast = useToastContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await axios.post(
        "https://aqk0rsung8.execute-api.us-east-1.amazonaws.com/dev/register",
        data
      );

      const loginResponse = await axios.post(
        "https://aqk0rsung8.execute-api.us-east-1.amazonaws.com/dev/login",
        data
      );

      try {
        const body = JSON.parse(loginResponse.data.body);
        if (body.error !== undefined) {
          addToast({ type: "error", message: "Failed to register" });
          return;
        }
      } catch {
        if (loginResponse.data.body.token) {
          localStorage.setItem("token", loginResponse.data.body.token);
          await getLoggedIn();
          navigate("/");
          addToast({ type: "success", message: "Successfully registered" });
        }
      }
    } catch (err) {
      addToast({ type: "error", message: "Failed to register" });
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
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group controlId="firstname">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            {...register("firstname", { required: true })}
            maxLength={20}
          />
        </Form.Group>
        {errors.firstName && (
          <p className={classess.errorText}>You must enter a First Name</p>
        )}
        <Form.Group className="mt-3" controlId="lastname">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            {...register("lastname", { required: true })}
            maxLength={20}
          />
        </Form.Group>
        {errors.lastName && (
          <p className={classess.errorText}>You must enter a Last Name</p>
        )}
        <Form.Group className="mt-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            {...register("email", {
              required: true,
              pattern:
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, //eslint-disable-line
            })}
          />
        </Form.Group>
        {errors.email && (
          <p className={classess.errorText}>Email must be valid</p>
        )}
        <Form.Group className="mt-3" controlId="password">
          <Form.Label>
            Password (Must have 1 uppercase character, 1 special character, and
            1 numeric character)
          </Form.Label>
          <Form.Control
            type="password"
            {...register("password", { required: true, minLength: 6 })}
          />
        </Form.Group>
        {errors.password && (
          <p className={classess.errorText}>
            Password must be at least 6 characters long
          </p>
        )}
        <Form.Group className="mt-3" controlId="passwordverify">
          <Form.Label>Password Verify</Form.Label>
          <Form.Control
            type="password"
            {...register("passwordverify", { required: true, minLength: 6 })}
          />
        </Form.Group>
        {errors.passwordVerify && (
          <p className={classess.errorText}>You must enter the same password</p>
        )}
        <Button type="submit" className="w-100 mt-4">
          Register
        </Button>
      </Form>
      <Link to="/login">
        <Button variant="secondary" className="w-100 mt-3">
          Switch to Login
        </Button>
      </Link>
    </Col>
  );
};

export default Register;
