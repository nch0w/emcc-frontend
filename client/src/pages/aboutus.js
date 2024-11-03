import React from "react";

import { Box } from "@material-ui/core";

import { ContactInfo, AboutUsInfo } from "../config";
import { SHeading, SContent } from "../styled_components";

const AboutUs = () => {
  return (
    <Box>
      <SHeading variant="h2">About Us</SHeading>
      <AboutUsInfo />
      <br />
      <SContent>
        <ContactInfo />
      </SContent>
    </Box>
  );
};

export default AboutUs;
