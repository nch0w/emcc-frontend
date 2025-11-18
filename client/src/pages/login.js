import React, { useState, useContext } from "react";

import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress
} from "@material-ui/core";
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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();

    // validate form
    if (!email.length || !pw.length) {
      Swal.fire("Error", "All fields are required", "error");
      return;
    }

    setLoading(true);
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
        window.scrollTo(0, 0);
        setTimeout(() => {
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }, 10);
      })
      .catch((error) => {
        Swal.fire("Error", error?.response?.data, "error");
        console.log(error);
      })
      .finally(() => {
        setLoading(false); // stop spinner no matter what
      });
  };

  return (
    <Box style={{ maxWidth: 800, margin: "auto" }}>
      <SHeading variant="h2">Log In</SHeading>
      <Box align="left">
        <Typography variant="body1" style={{ color: "green" }}>
          Don't have an account yet? You can{" "}
          <Link to="/signup">sign up here</Link>.
        </Typography>
        <br />
        <form onSubmit={handleLogin} autoComplete="on">
          <TextField
            required
            id="login-un"
            name="email" // important for browser heuristics
            label="Email Address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            variant="outlined"
            autoComplete="email"
            disabled={loading}
          />
          <br />
          <br />
          <TextField
            required
            id="login-pw"
            name="password" // important for browser heuristics
            label="Password"
            value={pw}
            onChange={(event) => setPw(event.target.value)}
            type="password"
            variant="outlined"
            autoComplete="current-password"
            disabled={loading}
          />
          <br />
          <br />
          <Button type="submit" variant="outlined" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : "Log In"}
          </Button>
        </form>
        <br />
        <br />
      </Box>
    </Box>
  );
};

export default Login;
