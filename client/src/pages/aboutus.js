import React from "react";

import { Box, Typography } from "@material-ui/core";

import { ContactInfo } from "../config";
import { SContentHeading, SHeading, SContent } from "../styled_components";

const AboutUs = () => {
  return (
    <Box>
      <SHeading variant="h2">About Us</SHeading>
      <Typography variant="body1">
        The EMCC is an annual math competition for middle schoolers, written and
        hosted by the students of the math club at Phillips Exeter Academy. In
        addition to organizing the EMCC, we participate in many competitions
        ourselves. At the 2024 HMMT February competition, team PEA Red placed
        3rd out of 91 of the strongest teams in the nation.
        <br />
        <br />
        Phillips Exeter Academy is a boarding high school in Exeter, New
        Hampshire—just a stone's throw from Boston.
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
