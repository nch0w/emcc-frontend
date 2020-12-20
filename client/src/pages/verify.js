import React, { useState, useContext, useEffect } from "react";
import { Container, Typography } from "@material-ui/core";
import axios from "axios";
import Swal from "sweetalert2";
import { emccServerUrl } from "../config";
import { Link, useNavigate } from "@reach/router";

function Verify({ tokenId }) {
  const navigate = useNavigate();
  const [errorMessage, setError] = useState("");
  useEffect(() => {
    axios
      .post(emccServerUrl + "/auth/verify", { tokenId })
      .then((response) => {
        navigate("/dashboard");
        Swal.fire("Email verified!", "", "success");
      })
      .catch((error) => {
        setError(error.response.data);
      });
  }, []);
  return (
    <Container>
      {errorMessage ? (
        <Typography variant="body1" align="left">
          There was an error verifying your email address:
          <br />
          {errorMessage}
          <br />
          <Link to="/">Return to homepage</Link>
        </Typography>
      ) : (
        <Typography variant="body1" align="left">
          Verifying...
        </Typography>
      )}
    </Container>
  );
}

export default Verify;
