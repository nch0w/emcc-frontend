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
          The tentative schedule for EMCC 2026 is shown below, subject to
          change.
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
                  <NoBorderTableCell>The Forum</NoBorderTableCell>
                </TableRow>
                <TableRow>
                  <NoBorderTableCell>
                    <nobr>10:00 am - 12:45 pm</nobr>
                  </NoBorderTableCell>
                  <NoBorderTableCell>
                    Individual and Team rounds
                  </NoBorderTableCell>
                  <NoBorderTableCell>Hahn Center</NoBorderTableCell>
                </TableRow>
                <TableRow>
                  <NoBorderTableCell>
                    <nobr>1:00 pm - 1:45 pm</nobr>
                  </NoBorderTableCell>
                  <NoBorderTableCell>Lunch</NoBorderTableCell>
                  <NoBorderTableCell>Hahn Center</NoBorderTableCell>
                </TableRow>
                <TableRow>
                  <NoBorderTableCell>
                    <nobr>2:00 pm - 3:30 pm</nobr>
                  </NoBorderTableCell>
                  <NoBorderTableCell>Guts Round</NoBorderTableCell>
                  <NoBorderTableCell>Hahn Center</NoBorderTableCell>
                </TableRow>
                <TableRow>
                  <NoBorderTableCell>
                    <nobr>3:45 pm - 4:45 pm</nobr>
                  </NoBorderTableCell>
                  <NoBorderTableCell>Guest Speaker</NoBorderTableCell>
                  <NoBorderTableCell>The Forum</NoBorderTableCell>
                </TableRow>
                <TableRow>
                  <NoBorderTableCell>
                    <nobr>5:00 pm - 6:00 pm</nobr>
                  </NoBorderTableCell>
                  <NoBorderTableCell>
                    Closing Ceremony (Awards)
                  </NoBorderTableCell>
                  <NoBorderTableCell>The Forum</NoBorderTableCell>
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
