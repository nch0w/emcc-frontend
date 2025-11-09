import React, { useState, useContext } from "react";

import { Box, Typography } from "@material-ui/core";
import { TextField, Button } from "@material-ui/core";
import { Link, useNavigate } from "@reach/router";
import axios from "axios";

import { UserContext, userStatus } from "../App";
import { emccServerUrl } from "../config";
import { SHeading } from "../styled_components";
import Swal from "sweetalert2";

const Login = () => {
  const { setCoachInfo, setTeams, setIndividuals, setAuthStatus } =
    useContext(UserContext);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    // validate form
    if (!email.length || !pw.length) {
      Swal.fire("Error", "All fields are required", "error");
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
        { timeout: 10000 }
      )
      .then((response) => {
        setAuthStatus(userStatus.UserLoaded);
        setCoachInfo(response.data.coachInfo);
        setTeams(response.data.teams);
        setIndividuals(response.data.individuals);
        navigate("/dashboard");
      })
      .catch((error) => {
        Swal.fire("Error", error?.response?.data, "error");
        console.log(error);
      });
  };

  return (
    <Box style={{ maxWidth: 800, margin: "auto" }}>
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
      </Box>
    </Box>
  );
};

export default Login;
