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
export const contestYear = 2021;
export const contestDate = "February 20, 2021";

// the status of the contest in question
export const contestStatus = "EMCC 2021 is not yet accepting registrations.";
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
export const registrationStarts = "November 14, 2020";
export const earlyRegistrationDeadline = "December 19, 2020";
export const lateRegistrationDeadline = "January 16, 2021";

// limits on teams and individuals per coach (used for display, NOT calculation)
// all limit calculation happens server-side
export const maxIndivsPerCoach = 3;
export const maxTeamsPerCoach = 3;
export const minTeamMembersPerTeam = 2;
export const maxTeamMembersPerTeam = 4;

// the EMCC server URL
export const emccServerUrl =
  process.env.REACT_APP_SERVER_URL || "http://localhost:3000/api";

const contactInfoStyles = makeStyles({
  media: {
    height: 200
  }
});

// names, emails, and picture locations of the current EMCC directors and web/registration guy
export const ContactInfo = () => {
  const classes = contactInfoStyles();
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="body1">
              Contact us by email at{" "}
              <a href="mailto:exetermathclub@gmail.com">
                exetermathclub@gmail.com
              </a>
              !
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6}>
        <Card>
          <CardMedia
            className={classes.media}
            // image={require("./assets/placeholder1.png")}
            title="Sanath Govindarajan"
          />
          <CardContent>
            <Typography variant="body1">
              <b>TBA</b>, Tournament Director
              <br />
              {/* Email:{" "}
              <Link to="sgovindarajan@exeter.edu">
                sgovindarajan@exeter.edu
              </Link> */}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6}>
        <Card>
          <CardMedia
            className={classes.media}
            // image={require("./assets/placeholder2.png")}
            title="Benjamin Wright"
          />
          <CardContent>
            <Typography variant="body1">
              <b>TBA</b>, Tournament Director
              <br />
              {/* Email: <Link to="bwright@exeter.edu">bwright@exeter.edu</Link> */}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="body1">
              <b>Neil Chowdhury</b>, Registrations
              <br />
              Email:{" "}
              <a href="mailto:nchowdhury@exeter.edu">nchowdhury@exeter.edu</a>
            </Typography>
          </CardContent>
        </Card>
      </Grid>
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
      <Typography variant="body1"> To be announced.</Typography>
    </Container>
  );
  // return (
  //   <Container align="center" maxWidth="sm">
  //     <SHeading variant="h3">Schedule</SHeading>
  //     <TableContainer component={Paper}>
  //       <Table>
  //         <TableHead>
  //           <TableRow>
  //             <TableCell>Start</TableCell>
  //             <TableCell>End</TableCell>
  //             <TableCell>Event</TableCell>
  //             <TableCell>Location</TableCell>
  //           </TableRow>
  //         </TableHead>
  //         <TableBody>
  //           <TableRow>
  //             <NoBorderTableCell>9:00</NoBorderTableCell>
  //             <NoBorderTableCell>10:00</NoBorderTableCell>
  //             <NoBorderTableCell>Registration</NoBorderTableCell>
  //             <NoBorderTableCell>Powell Hall (Music Center)</NoBorderTableCell>
  //           </TableRow>
  //           <TableRow>
  //             <TableCell colSpan={2} />
  //             <TableCell colSpan={2}>
  //               <Typography variant="body2">
  //                 Teams will be introduced to their proctors at registration. If
  //                 teams arrive late for registration, they should go directly to
  //                 the opening ceremony, in Assembly Hall.
  //               </Typography>
  //             </TableCell>
  //           </TableRow>
  //           <TableRow>
  //             <TableCell colSpan={2} />
  //             <TableCell>Light Breakfast</TableCell>
  //             <TableCell>Powell Hall (Music Center)</TableCell>
  //           </TableRow>
  //           <TableRow>
  //             <NoBorderTableCell>10:00</NoBorderTableCell>
  //             <NoBorderTableCell>10:30</NoBorderTableCell>
  //             <NoBorderTableCell>Opening Ceremony</NoBorderTableCell>
  //             <NoBorderTableCell>
  //               Assembly Hall (Academy Building)
  //             </NoBorderTableCell>
  //           </TableRow>
  //           <TableRow>
  //             <TableCell colSpan={2} />
  //             <TableCell colSpan={2}>
  //               <Typography variant="body2">
  //                 Proctors will lead teams after the opening ceremony directly
  //                 to their classrooms for the individual rounds.
  //               </Typography>
  //             </TableCell>
  //           </TableRow>
  //           <TableRow>
  //             <TableCell>10:30</TableCell>
  //             <TableCell>1:00</TableCell>
  //             <TableCell>Team and Individual Rounds</TableCell>
  //             <TableCell>Classrooms (Academy Building)</TableCell>
  //           </TableRow>
  //           <TableRow>
  //             <NoBorderTableCell>1:00</NoBorderTableCell>
  //             <NoBorderTableCell>1:30</NoBorderTableCell>
  //             <NoBorderTableCell>Lunch</NoBorderTableCell>
  //             <NoBorderTableCell>Academy Building</NoBorderTableCell>
  //           </TableRow>
  //           <TableRow>
  //             <TableCell colSpan={2} />
  //             <TableCell colSpan={2}>
  //               <Typography variant="body2">
  //                 Pizza will be available for free for students and coaches in
  //                 the classrooms in which the students took the contest. Parents
  //                 and other adults must bring their own lunch or buy lunch in
  //                 town.
  //               </Typography>
  //             </TableCell>
  //           </TableRow>
  //           <TableRow>
  //             <TableCell>1:45</TableCell>
  //             <TableCell>3:15</TableCell>
  //             <TableCell>Guts Round</TableCell>
  //             <TableCell>Assembly Hall (Academy Building)</TableCell>
  //           </TableRow>
  //           <TableRow>
  //             <TableCell>3:15</TableCell>
  //             <TableCell>3:30</TableCell>
  //             <TableCell>Break</TableCell>
  //             <TableCell>Assembly Hall (Academy Building)</TableCell>
  //           </TableRow>
  //           <TableRow>
  //             <TableCell>3:30</TableCell>
  //             <TableCell>4:00</TableCell>
  //             <TableCell>Awards</TableCell>
  //             <TableCell>Assembly Hall (Academy Building)</TableCell>
  //           </TableRow>
  //         </TableBody>
  //       </Table>
  //     </TableContainer>
  //   </Container>
  // );
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
        Individual total: The student who has a higher total score of speed and
        accuray round will be ranked higher. If a tie persists, the student who
        ranked higher in the accuracy round will be ranked higher overall. If a
        tie persists, the student who ranked higher in the speed round will be
        ranked higher.
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
