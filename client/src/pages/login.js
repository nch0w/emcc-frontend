import React, { useState, useContext } from "react";

import { Container, Box, Typography } from "@material-ui/core";
import { TextField, Button } from "@material-ui/core";
import { Link } from "@reach/router";
import axios from "axios";

import { UserContext } from "../App";
import { emccServerUrl } from "../config";
import { SHeading } from "../styled_components";

const loginStatus = {
  NotLoggedIn: "not-logged-in",
  InvalidForm: "invalid-form",
  LoginSuccess: "login-success",
  LoginFailure: "login-failure"
};

const Login = () => {
  const userContext = useContext(UserContext);
  const [status, setStatus] = useState(loginStatus.NotLoggedIn);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setError] = useState("");

  const handleLogin = () => {
    // validate form
    if (email.length === 0 || pw.length === 0) {
      setError("All fields are required.");
      setStatus(loginStatus.InvalidForm);
      return;
    }
    // submit form
    axios
      .post(
        emccServerUrl + "/auth/login",
        {
          email,
          password: pw
        },
        { timeout: 5000 }
      )
      .then((response) => {
        userContext.status = loginStatus.UserLoaded;
        userContext.user = response.data;
        setStatus(loginStatus.LoginSuccess);
      })
      .catch((error) => {
        console.log(error);
        setStatus(loginStatus.LoginFailure);
      });
  };

  const renderMessage = () => {
    switch (status) {
      case loginStatus.InvalidForm:
        return (
          <Typography variant="body1" align="left">
            Error: invalid login information
            <br />
            Reason: {err}
          </Typography>
        );
      case loginStatus.LoginSuccess:
        return (
          <Typography variant="body1">
            Successfully logged in as {userContext.user.name}
          </Typography>
        );
      case loginStatus.LoginFailure:
        return (
          <Typography variant="body1" align="left">
            Something went wrong; we could not update your info currently.
            Please try again in a few hours, and let us know at{" "}
            <Link to="mailto:exetermathclub@gmail.com">
              exetermathclub@gmail.com
            </Link>{" "}
            if the issue persists.
          </Typography>
        );
      default:
        return;
    }
  };

  return (
    <Container>
      <SHeading variant="h2">Log In</SHeading>
      <Box align="left">
        <Typography variant="body1">
          Don't already have an account? You can{" "}
          <Link to="/signup">sign up here</Link>.
        </Typography>
        <br />
        <br />
        <TextField
          required
          id="login-un"
          label="Email Address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          variant="outlined"
        />
        <br />
        <br />
        <TextField
          required
          id="login-pw"
          label="Password"
          value={pw}
          onChange={(event) => setPw(event.target.value)}
          type="password"
          variant="outlined"
        />
        <br />
        <br />
        <Button variant="outlined" onClick={() => handleLogin()}>
          Log In
        </Button>
        <br />
        <br />
        {renderMessage()}
      </Box>
    </Container>
  );
};

export default Login;
