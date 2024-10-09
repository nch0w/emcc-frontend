import React from "react";

import { Box, Typography } from "@material-ui/core";
import { Grid, Card, CardMedia, CardContent } from "@material-ui/core";
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
import { withStyles } from "@material-ui/core";
import MuiTableCell from "@material-ui/core/TableCell";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "@reach/router";

import { SHeading, SContentHeading } from "./styled_components";

// a set of app-wide constants in 1 place

// previously the configuration info was everywhere
// and I found it difficult and time-consuming
// to find them all and update them each year
// and sometimes even in-between the same year

// ironically, this file is called 'constants', but
// it's the one that changes from year to year

// contest year and date
export const contestYear = 2025;
export const contestDate = "January 25, 2024";

// the status of the contest in question
export const contestStatus = `Registration opening soon!`;
// export const contestStatus = () => (
//   <div>
//     {
//       "Registration for EMCC 2021 is closed. If you need to update your registration, contact "
//     }{" "}
//     <a href="mailto:exetermathclub@gmail.com" style={{ color: "white" }}>
//       exetermathclub@gmail.com
//     </a>
//     .
//     {
//       " We will be sending the Coaches' Packet and more information about the contest soon."
//     }
//   </div>
// );
// export const contestStatus = `EMCC ${contestYear} is not yet accepting registrations. Please stay tuned for details.`;
// export const contestStatus = 'Registration for EMCC 2021 is now open! Early registration ends ' + earlyRegistrationDeadline + '.'
// export const contestStatus = 'Registration for EMCC 2021 is now open! Late registration ends ' + lateRegistrationDeadline + '.'
// export const contestStatus = 'Registration for EMCC 2021 is closed! We look forward to seeing you at the contest.'

// registration costs (used for display, NOT calculation)
// all price calculation happens server-side
export const indivEarlyCost = "$15.00";
export const indivLateCost = "$22.50";
export const teamEarlyCost = "$50.00";
export const teamLateCost = "$75.00";

// deadlines for registration (used for display, NOT calculation)
// all price calculation happens server-side
export const registrationStarts = "December 13, 2023";
export const earlyRegistrationDeadline = "January 7, 2024";
export const lateRegistrationDeadline = "January 20, 2024";

// limits on teams and individuals per coach (used for display, NOT calculation)
// all limit calculation happens server-side
export const maxIndivsPerCoach = 3;
export const maxTeamsPerCoach = 3;
export const minTeamMembersPerTeam = 2;
export const maxTeamMembersPerTeam = 4;

// the EMCC server URL
export const emccServerUrl =
  //process.env.REACT_APP_SERVER_URL || "https://exetermathclub.com/api";
  process.env.REACT_APP_SERVER_URL || "http://localhost:3000/api";

const contactInfoStyles = makeStyles({
  media: {
    height: 200
  }
});

const members = [
  {
    name: "Benny Wang",
    email: "bbwang@exeter.edu",
    role: "Tournament Director"
  },
  {
    name: "Harini Venkatesh",
    email: "venkatesh@exeter.edu",
    role: "Tournament Director"
  },
  {
    name: "Bryan Chen",
    email: "bjchen@exeter.edu",
    role: "Tournament Director"
  },
  {
    name: "Michael Lu",
    email: "mzlu1@exeter.edu",
    role: "Tournament Director"
  },
  {
    name: "Shiqiao Zhang",
    email: "szhang6@exeter.edu",
    role: "Tournament Director"
  },
  {
    name: "Yash Shah",
    email: "ysshah@exeter.edu",
    role: "Tournament Director"
  }
];

// names, emails, and picture locations of the current EMCC directors and web/registration guy
export const ContactInfo = () => {
  const classes = contactInfoStyles();
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="body1">
              <b>Please send all questions to</b>{" "}
              <a href="mailto:exetermathclub@gmail.com">
                exetermathclub@gmail.com
              </a>
              . Do not contact the people below unless there is an emergency.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      {members.map((member) => (
        <Grid item xs={4}>
          <Card>
            {member.image && (
              <CardMedia
                className={classes.media}
                image={require(`./assets/${member.image}`)}
                title="Sanath Govindarajan"
              />
            )}
            <CardContent>
              <Typography variant="body1">
                <b>{member.name}</b>, {member.role}
                <br />
                Email: <a href={`mailto:${member.email}`}>{member.email}</a>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

// instructions for coaches to send their checks (may change)
export const CheckInstructions = () => {
  return (
    <div>
      Please make a check payable to
      <br />
      <b>Phillips Exeter Academy, Attn. Exeter Math Club Competition</b>
      <br />
      and mail it to:
      <br />
      <br />
      Zuming Feng
      <br />
      20 Main Street
      <br />
      Exeter, NH 03833
      <br />
      <br />
      We do not currently accept PayPal or other forms of electronic payment.
    </div>
  );
};

// the contest schedule

const NoBorderTableCell = withStyles({
  root: {
    borderBottom: "none"
  }
})(MuiTableCell);

export const ContestSchedule = () => {
  return (
    <Container align="center" maxWidth="sm">
      <SHeading variant="h3">Schedule</SHeading>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: 1000 }}>Time (EST)</TableCell>
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
              <NoBorderTableCell>Individual and Team rounds</NoBorderTableCell>
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
              <NoBorderTableCell>Exeter Snapshot Panel</NoBorderTableCell>
              <NoBorderTableCell>Forum</NoBorderTableCell>
            </TableRow>
            <TableRow>
              <NoBorderTableCell>
                <nobr>4:15 pm - 5:00 pm</nobr>
              </NoBorderTableCell>
              <NoBorderTableCell>Math at Exeter Panel</NoBorderTableCell>
              <NoBorderTableCell>Forum</NoBorderTableCell>
            </TableRow>
            <TableRow>
              <NoBorderTableCell>
                <nobr>5:00 pm - 6:00 pm</nobr>
              </NoBorderTableCell>
              <NoBorderTableCell>Closing Ceremony (Awards)</NoBorderTableCell>
              <NoBorderTableCell>Forum</NoBorderTableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

// the round formats, scoring, and tie-breaking information
// (all are interrelated)
export const RoundFormats = () => {
  let speedProblemCount = 20;
  let speedProblemWeight = 3;
  let speedTimeLimit = 25;

  let accuracyProblemCount = 10;
  let accuracyProblemWeight = 9;
  let accuracyTimeLimit = 45;

  let teamProblemCount = 15;
  let teamProblemWeight = 20;
  let teamTimeLimit = 60;

  let gutsProblemCount = 24;
  let gutsProblemWeights = [6, 7, 9, 11, 13, 15, 18, 21];
  let gutsTimeLimit = 75;

  let gutsProblemWeightsStr = gutsProblemWeights[0].toString();
  for (const weight of gutsProblemWeights.slice(1, gutsProblemWeights.length)) {
    gutsProblemWeightsStr += ", " + weight.toString();
  }

  let speedMaximumPoints = speedProblemCount * speedProblemWeight;
  let accuracyMaximumPoints = accuracyProblemCount * accuracyProblemWeight;
  let teamMaximumPoints = teamProblemCount * teamProblemWeight;
  let gutsMaximumPoints = 0;
  for (const weight of gutsProblemWeights) {
    gutsMaximumPoints += weight * 3;
  }
  let indivRoundsMaximumPoints = speedMaximumPoints + accuracyMaximumPoints;
  let teamRoundsMaximumPoints = teamMaximumPoints + gutsMaximumPoints;
  let sweepstakesMaximumPoints =
    4 * indivRoundsMaximumPoints + teamRoundsMaximumPoints;

  return (
    <Box>
      <br />
      <SHeading variant="h3">Round Formats</SHeading>
      <SContentHeading variant="h4">Individual Rounds</SContentHeading>
      <br />
      <Typography variant="body1">
        The individual rounds consist of two parts, taken one after another. The
        first part, the Speed Round, has {speedProblemCount} questions, each
        worth {speedProblemWeight} points, in {speedTimeLimit} minutes,
        emphasizing speed. The second part, the Accuracy Round, has{" "}
        {accuracyProblemCount} questions, each worth {accuracyProblemWeight}{" "}
        points, in {accuracyTimeLimit} minutes, emphasizing accuracy in problem
        solving. Each student's individual score is added to their team's score.
      </Typography>
      <br />
      <SContentHeading variant="h4">Team Round</SContentHeading>
      <br />
      <Typography variant="body1">
        The Team Round is a {teamTimeLimit} minute round where everybody on the
        team can work together to solve {teamProblemCount} questions, each worth{" "}
        {teamProblemWeight} points. The questions will mostly be unrelated to
        each other, but some of them may be strung together by a common theme.
      </Typography>
      <br />
      <SContentHeading variant="h4">Guts Round</SContentHeading>
      <br />
      <Typography variant="body1">
        The Guts Round is a live round consisting of {gutsProblemCount}{" "}
        questions in {gutsTimeLimit} minutes. The questions are given to the
        teams in sets of three. At the beginning of the round, each team will
        send a runner down to one of the scoring tables (spaced evenly
        throughout the contest hall to minimize differences in distance) to get
        the first set of three problems and bring it back to their team. The
        team then works together for as long as they need (within the 75 minute
        time limit) to solve these three problems. When they're ready, the
        runner drops off their answers at a scoring table, where they will
        receive the next set of three problems. At each scoring table, the
        problems will be scored as soon as they are dropped off, and a running
        tally of each team's points and progress will be displayed on a
        projector screen at the front of the hall. The point value for each
        problem increases between each set of three.
      </Typography>
      <br />
      <Typography variant="body1">
        <b>
          Past rounds can be found{" "}
          <a href="https://drive.google.com/open?id=1Yf7LzHUvCPIqZ4IKm-DtWVxO5S7nugDW">
            here
          </a>
          .
        </b>
      </Typography>
      <SContentHeading variant="h4">Scoring and Tie-Breaking</SContentHeading>
      <br />
      <Typography variant="body1">
        Rounds are scored as follows. Each of the {speedProblemCount} questions
        in the speed round is worth {speedProblemWeight} points, for a total of{" "}
        {speedMaximumPoints} points. Each of the {accuracyProblemCount}{" "}
        questions in the accuracy round is worth {accuracyProblemWeight} points,
        for a total of {accuracyMaximumPoints} points. In total, each individual
        can score up to {indivRoundsMaximumPoints} points. Each of the{" "}
        {teamProblemCount} questions in the team round is worth{" "}
        {teamProblemWeight} points, for a total of {teamMaximumPoints} points.
        Each of the {gutsProblemCount} questions in the guts round is weighted
        by set (in order, the weights are {gutsProblemWeightsStr}), for a total
        of {gutsMaximumPoints} points. Each team's sweepstakes score is
        calculated as the sum of the four individual scores (up to{" "}
        {4 * indivRoundsMaximumPoints} points) and the sum of the two team
        scores (up to {teamRoundsMaximumPoints} points), for a grand total of up
        to {sweepstakesMaximumPoints} points.
        <br />
        <br />
        In the case of a tie in any round, the tie will be broken as follows.
        <br />
        <br />
        Within a single round: The student or team who solved the last problem
        will be ranked higher. If the tie persists, the second last problem will
        be used, then the third last problem, and so on. A tie will not be
        broken in the case where two students or teams solved the exact same set
        of problems.
        <br />
        <br />
        Individual total: The student who has a higher individual score will be
        ranked higher. If a tie persists, the student who ranked higher in the
        accuracy round will be ranked higher. If a tie persists, the student who
        ranked higher in the speed round will be ranked higher.
        <br />
        <br />
        Team sweepstakes: The team who has a higher total score of team and guts
        round will be ranked higher. If a tie persists, the team who ranked
        higher in guts round will be ranked higher. If a tie still persists, the
        team who ranked higher in team round will be ranked higher.
        <br />
        <br />
        No individual or team will be tie-broken out of the top 10. For example,
        in the case of a three-way tie for the 9th place individual, after
        tie-breaking there will be one person receiving 9th place and two
        receiving 10th place.
      </Typography>
    </Box>
  );
};
