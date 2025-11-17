import React from "react";

import { Box, Typography } from "@material-ui/core";

import { ContestSchedule } from "../config";
import { SHeading, SContent } from "../styled_components";

const Schedule = () => {
  return (
    <Box>
      <SHeading variant="h2">Schedule</SHeading>

      <SContent>
        <Typography variant="body1">
          The date for EMCC 2026 will be announced on November 19th. For now,
          the schedule for EMCC 2025 is shown below. The EMCC 2026 schedule will
          be similar.
        </Typography>
        <br />
        <br />
        <ContestSchedule />
      </SContent>
    </Box>
  );
};

export default Schedule;
