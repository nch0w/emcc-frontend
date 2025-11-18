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
            participate on a team of four. Students do not need to have a team
            when registering.
            <br />
            <br />
            Individuals who register without a team will be placed on one before
            the competition—this may either be a registered team with less than
            four students, or a new team composed entirely of individuals. If
            you are the coach of a team with less than 4 people and you would
            not like additional individuals on your team, please reach out to
            us. We would be happy to accomodate you!
            <br />
            <br />
            <SLowkey variant="h5">Registration</SLowkey>
            Registration takes place on this website, <a href="/signup">here</a>
            . Coaches and parents can add students and teams after creating an
            account. Coaches may register as many teams and individuals as they
            would like. Students do not need to make an account. <br />
            <br />
            There is a $60.00 entry fee per team and a $20.00 entry fee per
            individual registration.
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
            Please reach out to
            <a href="exetermathclub@gmail.com">exetermathclub@gmail.com</a>
            if you are interested in this. The subsidization will be offered on
            a first-come, first-serve basis. <br />
            <br />
          </Typography>
        </section>

        <br />
        <section id="format">
          <SContentHeading variant="h3">Format</SContentHeading>
          <Typography variant="body1">
            <SLowkey variant="h5">Individual Rounds</SLowkey>
            The individual rounds consist of two parts, taken one after another.
            The first part, the Speed Round, has 20 questions, each worth 3
            points, in 25 minutes, emphasizing speed. The second part, the
            Accuracy Round, has 10 questions, each worth 9 points, in 45
            minutes, emphasizing accuracy in problem solving. Each student's
            individual score is added to their team's score. <br />
            <br />
            <SLowkey variant="h5">Team Round</SLowkey>
            The Team Round is a 60 minute round where everybody on the team can
            work together to solve 15 questions, each worth 20 points. The
            questions will mostly be unrelated to each other, but some of them
            may be strung together by a common theme. <br />
            <br />
            <SLowkey variant="h5">Guts Round</SLowkey>
            The Guts Round is a live round consisting of 27 questions in 75
            minutes. The questions are given to the teams in eight sets of
            three, plus an extra estimation round at the end with three more
            problems. At the beginning of the round, each team will send a
            runner down to one of the scoring tables (spaced evenly throughout
            the contest hall to minimize differences in distance) to get the
            first set of three problems and bring it back to their team. The
            team then works together for as long as they need (within the 75
            minute time limit) to solve these three problems. When they're
            ready, the runner drops off their answers at a scoring table, where
            they will receive the next set of three problems. At each scoring
            table, the problems will be scored as soon as they are dropped off,
            and a running tally of each team's points and progress will be
            displayed on a projector screen at the front of the hall. The point
            value for each problem increases between each set of three.
            <br />
            <br />
            Past rounds can be found <a href="/archives">here</a>.<br />
            <br />
            <SLowkey variant="h5">Scoring and Tie-Breaking</SLowkey>
            Rounds are scored as follows. Each of the 20 questions in the speed
            round is worth 3 points, for a total of 60 points. Each of the 10
            questions in the accuracy round is worth 9 points, for a total of 90
            points. In total, each individual can score up to 150 points. Each
            of the 15 questions in the team round is worth 20 points, for a
            total of 300 points. Each of the 27 questions in the guts round is
            weighted by set (in order, the weights are 6, 7, 9, 11, 13, 15, 18,
            21, 10), for a total of 300 points. In particular, the estimation
            round, worth 10 points per question, is scored as extra credit; it
            is possible for a team to score up to a 330/300 on the Guts round.
            Each team's sweepstakes score is calculated as the sum of the four
            individual scores (out of 600 points) and the sum of the two team
            scores (out of 600points), for a grand total of up to 1200 points.
            <br />
            <br />
            In the case of a tie in any round, the tie will be broken as
            follows.
            <br />
            <br />
            Within a single round: The student or team who solved the last
            problem will be ranked higher. If the tie persists, the second last
            problem will be used, then the third last problem, and so on. A tie
            will not be broken in the case where two students or teams solved
            the exact same set of problems. <br />
            <br />
            Individual total: The student who has a higher individual score will
            be ranked higher. If a tie persists, the student who ranked higher
            in the accuracy round will be ranked higher. If a tie persists, the
            student who ranked higher in the speed round will be ranked higher.
            <br />
            <br />
            Team sweepstakes: The team who has a higher total score of team and
            guts round will be ranked higher. If a tie persists, the team who
            ranked higher in guts round will be ranked higher. If a tie still
            persists, the team who ranked higher in team round will be ranked
            higher.
            {/* <br />
            <br />
            No individual or team will be tie-broken out of the top 10. For example,
            in the case of a three-way tie for the 9th place individual, after
            tie-breaking there will be one person receiving 9th place and two
            receiving 10th place. */}
          </Typography>
        </section>
        <br />
        <section id="rules">
          <SContentHeading variant="h3">Rules</SContentHeading>
          <br />
          <Typography variant="body1">
            Books, notes, calculators, pocket organizers, slide-rules, abaci,
            calculator wrist watches, or any other kind of computational aid are
            prohibited during all parts of the competition. The same goes for
            graph paper, rulers, protractors, compasses, or any other drawing
            aid. Similarly, laptops, PDAs, cell phones, or any other electronic
            communication devices are also not allowed. Any individual or team
            which breaks these rules will be disqualified.
            <br />
            <br />
            All decisions made by the EMCC judges are final.
          </Typography>
        </section>
      </SContent>
    </Box>
  );
};

export default Contest;
