import React from "react";

import { Box, Typography } from "@material-ui/core";
import {
  Container,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from "@material-ui/core";
import { SHeading, SContent } from "../styled_components";
import { withStyles } from "@material-ui/core";
import MuiTableCell from "@material-ui/core/TableCell";

const NoBorderTableCell = withStyles({
  root: {
    borderBottom: "none"
  }
})(MuiTableCell);

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
        <Container align="center" maxWidth="sm">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Time (EST)</TableCell>
                  <TableCell>Event</TableCell>
                  <TableCell>Location</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <NoBorderTableCell>
                    <nobr>8:00 am - 9:00 am</nobr>
                  </NoBorderTableCell>
                  <NoBorderTableCell>
                    <nobr>Registration</nobr>
                  </NoBorderTableCell>
                  <NoBorderTableCell>Phillips Hall</NoBorderTableCell>
                </TableRow>
                <TableRow>
                  <NoBorderTableCell>
                    <nobr>9:15 am - 9:45 am</nobr>
                  </NoBorderTableCell>
                  <NoBorderTableCell>Opening Ceremony</NoBorderTableCell>
                  <NoBorderTableCell>Assembly Hall</NoBorderTableCell>
                </TableRow>
                <TableRow>
                  <NoBorderTableCell>
                    <nobr>10:00 am - 12:30 pm</nobr>
                  </NoBorderTableCell>
                  <NoBorderTableCell>
                    Individual and Team rounds
                  </NoBorderTableCell>
                  <NoBorderTableCell>Classrooms</NoBorderTableCell>
                </TableRow>
                <TableRow>
                  <NoBorderTableCell>
                    <nobr>12:45 pm - 1:30 pm</nobr>
                  </NoBorderTableCell>
                  <NoBorderTableCell>Lunch</NoBorderTableCell>
                  <NoBorderTableCell>Classrooms</NoBorderTableCell>
                </TableRow>
                <TableRow>
                  <NoBorderTableCell>
                    <nobr>1:45 pm - 3:15 pm</nobr>
                  </NoBorderTableCell>
                  <NoBorderTableCell>Guts Round</NoBorderTableCell>
                  <NoBorderTableCell>Assembly Hall</NoBorderTableCell>
                </TableRow>
                <TableRow>
                  <NoBorderTableCell>
                    <nobr>3:30 pm - 4:15 pm</nobr>
                  </NoBorderTableCell>
                  <NoBorderTableCell>Math at Exeter Panel</NoBorderTableCell>
                  <NoBorderTableCell>Assembly Hall</NoBorderTableCell>
                </TableRow>
                <TableRow>
                  <NoBorderTableCell>
                    <nobr>4:15 pm - 5:00 pm</nobr>
                  </NoBorderTableCell>
                  <NoBorderTableCell>Exeter Snapshot Panel</NoBorderTableCell>
                  <NoBorderTableCell>Assembly Hall</NoBorderTableCell>
                </TableRow>
                <TableRow>
                  <NoBorderTableCell>
                    <nobr>5:00 pm - 6:00 pm</nobr>
                  </NoBorderTableCell>
                  <NoBorderTableCell>
                    Closing Ceremony (Awards)
                  </NoBorderTableCell>
                  <NoBorderTableCell>Assembly Hall</NoBorderTableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </SContent>
    </Box>
  );
};

export default Schedule;
