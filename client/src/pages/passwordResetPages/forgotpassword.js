import React, { useState, useContext, useEffect } from "react";
import { TextField, Box, Button, CircularProgress } from "@material-ui/core";
import { SHeading } from "../../styled_components";
import Swal from "sweetalert2";
import { UserContext, userStatus } from "../../App";
import { useNavigate } from "@reach/router";
import { emccServerUrl } from "../../config";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { authStatus } = useContext(UserContext);

  //redirect user to dashboard if already logged in
  useEffect(() => {
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

  //on reset
  const handleSendReset = () => {
    if (!email) {
      Swal.fire("Error", "All fields are required.", "error");
      return;
    }
    setLoading(true);

    axios
      .post(
        emccServerUrl + "/auth/sendreset",
        {
          email
        },
        { timeout: 10000 }
      )
      .then((_response) => {
        Swal.fire(
          "Success",
          "If the email address you entered was valid, you should have received an password reset email.",
          "success"
        );
        navigate("/"); //go home
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
        setEmail("");
      });
    return;
  };

  return (
    <Box>
      <SHeading variant="h2">Forgot Password</SHeading>
      <TextField
        required
        id="email"
        label="Email Address"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        variant="outlined"
      />{" "}
      <br /> <br />
      <Button
        variant="outlined"
        onClick={() => handleSendReset()}
        disabled={loading}
      >
        {loading ? <CircularProgress size={20} /> : "Send Reset Email"}
      </Button>
    </Box>
  );
};
export default ForgotPassword;
