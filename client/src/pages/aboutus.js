import React from "react";

import { Box } from "@material-ui/core";

import { ContactInfo, AboutUsInfo } from "../config";
import { SContentHeading, SHeading, SContent } from "../styled_components";

const AboutUs = () => {
  return (
    <Box>
      <SHeading variant="h2">About Us</SHeading>
      <AboutUsInfo />
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
