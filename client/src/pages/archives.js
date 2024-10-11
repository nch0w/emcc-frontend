import React from "react";

import { Box } from "@material-ui/core";

import { ContactInfo } from "../config";
import { SHeading, SContent } from "../styled_components";

const Archives = () => {
  return (
    <Box>
      <SHeading variant="h2">Archives</SHeading>
      <SContent>
        <ContactInfo />
      </SContent>
    </Box>
  );
};

export default Archives;
