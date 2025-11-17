import React from "react";

import { Box, Typography } from "@material-ui/core";

import { RoundFormats } from "../config";
import { SHeading, SContent } from "../styled_components";

const Contest = () => {
  return (
    <Box>
      <SHeading variant="h2">Contest Information</SHeading>
      <SContent>
        <RoundFormats />
        <br />
        <SHeading variant="h2">Rules</SHeading>
        <br />
        <Typography variant="body1">
          Books, notes, calculators, pocket organizers, slide-rules, abaci,
          calculator wrist watches, or any other kind of computational aid are
          prohibited during all parts of the competition. The same goes for
          graph paper, rulers, protractors, compasses, or any other drawing aid.
          Similarly, laptops, PDAs, cell phones, or any other electronic
          communication devices are also not allowed. Any individual or team
          which breaks these rules will be disqualified.
        </Typography>
        <br />
        <Typography variant="body1">
          <b>All decisions made by the EMCC judges are final.</b>
        </Typography>
      </SContent>
    </Box>
  );
};

export default Contest;
