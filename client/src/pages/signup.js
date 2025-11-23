import React, { useState, useContext, useEffect } from "react";

import { Box, Typography } from "@material-ui/core";
import { TextField, Button, CircularProgress } from "@material-ui/core";
import { useNavigate } from "@reach/router";
import axios from "axios";
import { UserContext, userStatus } from "../App";

import { emccServerUrl } from "../config";
import { SHeading } from "../styled_components";
import Swal from "sweetalert2";

const SignUp = () => {
  const [un, setUn] = useState("");
  const [pw, setPw] = useState("");
  const [cpw, setCpw] = useState("");
  const [mail, setMail] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { authStatus } = useContext(UserContext);
  useEffect(() => {
    console.log(authStatus);
    console.log(userStatus.UserLoaded);
    if (authStatus === userStatus.UserLoaded) {
      navigate("/dashboard");
      window.scrollTo(0, 0);
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 10);
    }
  }, [authStatus, navigate]);

  const handleSignup = (event) => {
    // validate form
    event.preventDefault();
    if (
      un.length === 0 ||
      pw.length === 0 ||
      cpw.length === 0 ||
      email.length === 0
    ) {
      Swal.fire("Error", "All fields are required.", "error");
      return;
    }
    if (pw !== cpw) {
      Swal.fire(
        "Error",
        "Password and Confirm Password do not match.",
        "error"
      );
      return;
    }

    setLoading(true);
    // submit form
    axios
      .post(
        emccServerUrl + "/auth/signup",
        {
          name: un,
          password: pw,
          email,
          phone,
          mail
        },
        { timeout: 3000 }
      )
      .then((_response) => {
        Swal.fire(
          "Success",
          "You were signed up. Please check for a confirmation email to log in.",
          "success"
        );
      })
      .catch((error) => {
        console.log(error);
        Swal.fire("Error", error?.response?.data, "error");
      })
      .finally(() => {
        setLoading(false); // stop spinner no matter what
      });
  };

  return (
    <Box>
      <SHeading variant="h2">Sign Up</SHeading>
      <Typography variant="body1">
        Each coach should sign up for exactly one account. Teams, students, and
        parents do not need to sign up. If you are a student who would like to
        participate in EMCC, please contact your school's coach. If you would
        like to participate as an individual and your school is not
        participating, your parent or guardian can sign up as your coach.
      </Typography>
      <br />
      <Typography variant="body1" style={{ color: "green" }}>
        Already have an account? You can <a href="/login">log in here</a>.
      </Typography>
      <br />
      <br />
      <form onSubmit={handleSignup} autoComplete="on">
        <TextField
          required
          id="signup-email"
          label="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          variant="outlined"
        />
        <br />
        <br />
        <TextField
          required
          id="signup-un"
          label="Name"
          value={un}
          onChange={(event) => setUn(event.target.value)}
          variant="outlined"
        />
        <br />
        <br />
        <TextField
          required
          id="coach-phone"
          label="Phone Number"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          type="tel"
          variant="outlined"
        />
        <br />
        <br />
        <TextField
          required
          id="coach-mail"
          label="Mailing Address"
          value={mail}
          onChange={(event) => setMail(event.target.value)}
          variant="outlined"
        />
        <br />
        <br />
        <TextField
          required
          id="signup-pw"
          label="Password"
          name="password"
          value={pw}
          onChange={(event) => setPw(event.target.value)}
          type="password"
          variant="outlined"
          autoComplete="new-password"
        />
        <br />
        <br />
        <TextField
          required
          id="signup-cpw"
          name="confirm-password"
          label="Confirm Password"
          value={cpw}
          onChange={(event) => setCpw(event.target.value)}
          type="password"
          variant="outlined"
          autoComplete="new-password"
        />

        <br />
        <br />
        <Button type="submit" variant="outlined" disabled={loading}>
          {loading ? <CircularProgress size={20} /> : "Sign Up"}
        </Button>
        <br />
        <br />
        <Typography variant="body1">
          You should receive a confirmation email once you have signed up
          successfully.
        </Typography>
        <br />
        <br />
      </form>
    </Box>
  );
};

export default SignUp;
