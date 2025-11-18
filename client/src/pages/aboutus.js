import React from "react";

import { Box, Typography } from "@material-ui/core";

import { ContactInfo } from "../config";
import {
  SContentHeading,
  SHeading,
  SContent,
  SCaption
} from "../styled_components";

const AboutUs = () => {
  return (
    <Box>
      <SHeading variant="h2">About Us</SHeading>
      <Typography variant="body1">
        In addition to organizing the EMCC, we participate in many competitions
        ourselves. At the 2024 HMMT February competition, team PEA Red placed
        3rd out of 91 of the strongest teams in the nation.
      </Typography>
      <br />
      <br />
      <center>
        <img
          id="club_photo"
          alt="Math Club"
          style={{
            verticalAlign: "middle",
            width: "60%"
          }}
          src={require("../assets/clubPhoto.png")}
        />
      </center>
      <SCaption>Figure 2: 2024-2025 Math Club</SCaption>
      <br />
      <SContentHeading variant="h4">EMCC Team</SContentHeading>
      <br />
      <SContent>
        {" "}
        {/* To edit profiles go to config.js */}
        <ContactInfo />
      </SContent>
    </Box>
  );
};

export default AboutUs;
