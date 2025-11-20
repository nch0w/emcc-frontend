import React, { useState, useContext, useEffect } from "react";
import { TextField, Box, Button, CircularProgress } from "@material-ui/core";
import { SHeading } from "../../styled_components";
import Swal from "sweetalert2";
import { UserContext, userStatus } from "../../App";
import { useNavigate } from "@reach/router";
import { emccServerUrl } from "../../config";
import axios from "axios";

function NewPassword({ tokenId }) {
  const [pwd, setPwd] = useState("");
  const [cpwd, setCpwd] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { authStatus } = useContext(UserContext);

  //redirect user to dashboard if already logged in
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

  //on reset
  const handlePasswordEntered = (event) => {
    event.preventDefault();
    if (!pwd || !cpwd) {
      Swal.fire("Error", "All fields are required.", "error");
      return;
    }
    if (pwd !== cpwd) {
      setCpwd("");
      Swal.fire("Error", "Passwords do not match.", "error");
      return;
    }
    setLoading(true);
    axios
      .post(emccServerUrl + "/auth/resetpassword", { tokenId, pwd })
      .then((response) => {
        navigate("/dashboard");
        window.scrollTo(0, 0);
        setTimeout(() => {
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }, 10);
        Swal.fire("Password Reset Successful", "", "success");
      })
      .catch((error) => {
        Swal.fire("Error", error?.response?.data, "error");
        console.log(error);
      })
      .finally(() => {
        setLoading(false); // stop spinner no matter what
        setPwd("");
        setCpwd("");
      });
    return;
  };

  return (
    <Box>
      <SHeading variant="h2">Reset Password</SHeading>
      <form onSubmit={handlePasswordEntered} autoComplete="on">
        <TextField
          required
          id="pwd"
          label="New Password"
          type="password"
          value={pwd}
          onChange={(event) => setPwd(event.target.value)}
          variant="outlined"
        />{" "}
        <br /> <br />
        <TextField
          required
          id="cpwd"
          label="Confirm New Password"
          type="password"
          value={cpwd}
          onChange={(event) => setCpwd(event.target.value)}
          variant="outlined"
        />{" "}
        <br /> <br />
        <Button variant="outlined" type="submit" disabled={loading}>
          {loading ? <CircularProgress size={20} /> : "Set Password"}
        </Button>
      </form>
    </Box>
  );
}
export default NewPassword;
