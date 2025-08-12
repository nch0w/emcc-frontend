import React from "react";

import { Box, Typography } from "@material-ui/core";

import {
  contestYear,
  ContestSchedule,
  RoundFormats,
  pageWidth
} from "../config";
import { SHeading, SContent } from "../styled_components";

const Contest = () => {
  return (
    <Box style={{ maxWidth: pageWidth, margin: "auto" }}>
      <SHeading variant="h2">Contest Information</SHeading>

      <SContent>
        <Typography variant="body1">
          The Exeter Math Club Competition will be being hosted in person in
          2025. This means all testing and grading will be taking place on site
          on the Phillips Exeter Academy campus. Below is the schedule that the
          2025 EMCC will run on:
        </Typography>

        <ContestSchedule />
        <RoundFormats />
        <br />
        <Typography variant="h3" align="center">
          Rules
        </Typography>
        <br />
        <Typography variant="h4" align="center">
          Prohibited Items
        </Typography>
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
