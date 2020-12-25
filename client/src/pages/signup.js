import React, { useState } from "react";

import { Container, Box, Typography } from "@material-ui/core";
import { TextField, Button } from "@material-ui/core";
import { Link } from "@reach/router";
import axios from "axios";

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
  const handleSignup = () => {
    // validate form
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
        { timeout: 5000 }
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
      });
  };

  return (
    <Container>
      <SHeading variant="h2">Sign Up</SHeading>
      <Box align="left">
        <Typography variant="body1">
          Each coach should sign up for exactly one account. Teams, students,
          and parents do not need to sign up. If you are a student who would
          like to participate in EMCC, please contact your school's coach. If
          you would like to participate as an individual and your school is not
          participating, your parent or guardian can sign up as your coach.
        </Typography>
        <br />
        <Typography variant="body1" style={{ color: "green" }}>
          Already have an account? You can <Link to="/login">log in here</Link>.
        </Typography>
        <br />
        <br />
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
          value={pw}
          onChange={(event) => setPw(event.target.value)}
          type="password"
          variant="outlined"
        />
        <br />
        <br />
        <TextField
          required
          id="signup-cpw"
          label="Confirm Password"
          value={cpw}
          onChange={(event) => setCpw(event.target.value)}
          type="password"
          variant="outlined"
        />

        <br />
        <br />
        <Button variant="outlined" onClick={() => handleSignup()}>
          Sign Up
        </Button>
        <br />
        <br />
        <Typography variant="body1">
          You should receive a confirmation email once you have signed up
          successfully.
        </Typography>
        <br />
        <br />
      </Box>
    </Container>
  );
};

export default SignUp;
