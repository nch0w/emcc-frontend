import React from "react";

import { Box, Typography } from "@material-ui/core";

import {
  SContentHeading,
  SHeading,
  SContent,
  SCaption,
  SLowkey
} from "../styled_components";

const sections = [
  { id: "general", label: "General Information" },
  { id: "format", label: "Competiton Format" },
  { id: "rules", label: "Rules" }
];

const TableOfContents = () => {
  return (
    <nav className="toc">
      <ul>
        {sections.map((s) => (
          <li key={s.id}>
            <a href={`#${s.id}`}>{s.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

const Contest = () => {
  return (
    <Box>
      <SHeading variant="h2">Contest Information</SHeading>
      <SContent>
        <section id="general">
          <Typography variant="body1">
            <TableOfContents />
            <SContentHeading variant="h3">General Information</SContentHeading>
            The Exeter Math Club Competition is an annual math competition for
            middle schoolers. The competition is a day-long event that takes
            place in-person at the Phillips Exeter Academy. <br />
            <br />
            <center>
              <img
                id="club_photo"
                alt="The Academy Building"
                style={{
                  verticalAlign: "middle",
                  width: "70%"
                }}
                src={require("../assets/peaPhoto.jpg")}
              />
            </center>
            <SCaption>Figure 1: The Academy Building</SCaption>
            <br />
            <SLowkey variant="h5">Eligibility</SLowkey>
            Students in eighth grade and below may participate. We encourage
            elementary school students to participate as well!
            <br />
            <br />
            <SLowkey variant="h5">Teams</SLowkey>
            The EMCC is composed of two individual rounds and two team rounds
            (see <a href={`#format`}>format</a>). As such, every student will
            participate on a team of four. If a student does not have a team,
            their parent/coach may register them as an "individual".
            <br />
            <br />
            Such individuals will be placed on a team before the
            competition—this may either be a registered team with less than four
            students, or a new team composed entirely of individuals. If you are
            the coach of a team with less than four students and you would not
            like additional individuals on your team, please reach out to us. We
            would be happy to accomodate you!
            <br />
            <br />
            <SLowkey variant="h5">Registration</SLowkey>
            Registering for the EMCC takes three steps:
            <ol>
              <li>
                Create a coach account <a href="/signup">here</a>.
              </li>
              <li>Add teams and individuals in the coach portal.</li>
              <li>
                Pay the registration fee through the payment portal. There is a
                $60.00 entry fee per team and a $20.00 entry fee per individual.
                The payment portal will open in December.
              </li>
            </ol>
            Coaches may register as many teams and individuals as they would
            like. Students do not need to make an account. <br />
            <br />
            <br />
            <SLowkey variant="h5">Travel</SLowkey>
            Phillips Exeter Academy is located in Exeter, New Hampshire. We are
            an hour's drive from the Boston Logan airport. This year, thanks to
            the generous support of our sponsor,{" "}
            <a href="https://www.hudsonrivertrading.com/">
              Hudson River Trading
            </a>
            , we are able to subsidize lodging costs for groups of four or more.
            Please reach out to{" "}
            <a href="exetermathclub@gmail.com">exetermathclub@gmail.com</a> if
            you are interested in this. The subsidization will be offered on a
            first-come, first-serve basis. <br />
            <br />
          </Typography>
        </section>

        <br />
        <section id="format">
          <Typography variant="body1">
            <SContentHeading variant="h3">Format</SContentHeading>
            The EMCC is composed of four rounds: the Speed Round, the Accuracy
            Round, the Team Round and the Guts Round. There is no distinction in
            the types of problems that may appear on each round. For each round,
            problems are roughly ordered in increasing difficulty. <br />
            <br />
            <b>
              The scoring weights of each round have been adjusted for EMCC
              2026. Moreover, the Guts Round has been changed from 8 rounds of 3
              problems to 6 rounds of 4 problems.
            </b>
            <br />
            <br />
            <SLowkey variant="h5">Speed Round</SLowkey>
            The Speed Round is the first of two individual rounds. There are 20
            questions to be solved in 25 minutes. Each question is worth 1
            point. <br />
            <br />
            <SLowkey variant="h5">Accuracy Round</SLowkey>
            The Accuracy Round is the second individual round. There are 10
            questions to be solved in 45 minutes. Each question is worth 2
            points. <br />
            <br />
            <SLowkey variant="h5">Team Round</SLowkey>
            The Team Round is the first of two team-based rounds. Team members
            work together to solve 15 questions in 60 minutes. Each question is
            worth 12 points. <br />
            <br />
            <SLowkey variant="h5">Guts Round</SLowkey>
            The Guts Round is the second team-based round. Team members work
            together to solve 24 questions in 75 minutes. The point value of
            each question increases as the test progresses (see the next
            section). The Guts Round is divided into six sets of four problems.
            Beginning from the first set, a team must submit their answers to
            the set before receiving the problems in the subsequent set. The
            team can work on one set for as long as they wish (within the 75
            minute time limit). Once submitted, answers to previous sets cannot
            be changed. During the Guts Round, a live scoreboard shows the
            progress and score of each team. <br /> <br />
            In addition to the six mathematical sets, there is an "estimation
            set" that comes after the sixth set. The four questions on this set
            are estimation-based.
            <br />
            <br />
            Past rounds can be found <a href="/archives">here</a>.<br />
            <br />
            <SLowkey variant="h5">Scoring and Tie-Breaking</SLowkey>
            Rounds are scored as follows:
            <ul>
              <li>
                <b>Speed Round:</b> 20 questions, each worth 1 point, for a
                total of 20 points.
              </li>
              <li>
                <b>Accuracy Round:</b> 10 questions, each worth 2 points, for a
                total of 20 points.
              </li>
              <li>
                <b>Team Round:</b> 15 questions, each worth 12 points, for a
                total of 180 points.
              </li>
              <li>
                <b>Guts Round:</b> 24 questions. The questions are weighted by
                set—in order, the point values are 4, 5, 6, 7, 8 and 10
                points—for a total of 160 points. Each problem on the estimation
                round is worth 5 points of extra credit—it is possible for a
                team to score 180/160 on the Guts round.
              </li>
            </ul>
            An individual's overall score is the sum of the points earned on the
            Speed Round and Accuracy Round, for a total of up to 40 points. A
            team's overall score (their <i>sweepstakes score</i>) is the sum of
            the four individual scores and the points earned on the Team Round,
            the Guts Round, for a total of up to 500 points.
            <br />
            <br />
            In the case of a tie in any round, the tie will be broken as
            follows.
            <ul>
              <li>
                <b>Within a single round:</b> The student or team who solved the
                last problem will be ranked higher. If the tie persists, the
                second last problem will be used, then the third last problem,
                and so on. A tie will not be broken in the case where two
                students or teams solved the exact same set of problems.
              </li>
              <li>
                <b>Individual total:</b> The student who has a higher individual
                score will be ranked higher. If a tie persists, the student who
                ranked higher in the accuracy round will be ranked higher. If a
                tie persists, the student who ranked higher in the speed round
                will be ranked higher.
              </li>
              <li>
                <b>Team sweepstakes:</b> The team who has a higher total score
                of team and guts round will be ranked higher. If a tie persists,
                the team who ranked higher in guts round will be ranked higher.
                If a tie still persists, the team who ranked higher in team
                round will be ranked higher.
              </li>
            </ul>
          </Typography>
        </section>
        <br />
        <section id="rules">
          <Typography variant="body1">
            <SContentHeading variant="h3">Rules</SContentHeading>
            Calculators or any other kind of computational aid are prohibited in
            the competition. Rulers, compasses, protractors or any other kind of
            drawing aid are also prohibited. Any individual or team which breaks
            these rules will be disqualified. We suggest bringing plenty of
            pencils, a pencil sharpener, water and snacks to the competition.
          </Typography>
        </section>
      </SContent>
    </Box>
  );
};

export default Contest;
