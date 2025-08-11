import React, { useContext } from "react";

import { Box, Typography } from "@material-ui/core";

import { contestDate, contestStatus } from "../config";
import {
  SHero,
  SHeroHeading,
  SHeroSubheading,
  SContent
} from "../styled_components";
import { Link } from "@reach/router";
import { userStatus, UserContext } from "../App";
import { SpecialHeader } from "../homepageLogo";

const Home = () => {
  const {
    coachInfo,
    teams,
    individuals,
    setCoachInfo,
    setTeams,
    setIndividuals,
    authStatus,
    setAuthStatus
  } = useContext(UserContext);
  return (
    <Box>
      <SpecialHeader />
      <SHero style={{ maxWidth: 1200 }}>
        <SHeroSubheading variant="h3">
          The Exeter Math Club Competition
        </SHeroSubheading>
        <SHeroSubheading variant="h5">
          {contestDate}, in person at Exeter
        </SHeroSubheading>
        <SHeroSubheading variant="h6">
          {/* <Link
            to={authStatus === userStatus.UserLoaded ? "/dashboard" : "/signup"}
            style={{ color: "white" }}
          > */}
          {contestStatus}
          {/* </Link> */}
        </SHeroSubheading>
      </SHero>
      <br />
      <br />
      <SContent style={{ maxWidth: 1200 }}>
        <Typography variant="h4" align="center">
          Sponsored by
          <br />
          <br />
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.janestreet.com/join-jane-street/info-booth/"
          >
            <img
              id="jane_street_logo"
              alt="Jane Street logo"
              style={{
                verticalAlign: "middle",
                maxHeight: 90,
                marginBottom: 20
              }}
              src={require("../assets/jane_street_fr.png")}
            />
          </a>
        </Typography>

        <br />
        <br />
        <Typography variant="body1">
          The Exeter Math Club Competition is an annual math competition for
          middle schoolers, written and run by students at Phillips Exeter
          Academy in New Hampshire. Every year since 2010, in January, teams of
          four come from around the world to compete in-person at Exeter.{" "}
          {/* <br />
          <br />
          Registration is now open! Coaches may{" "}
          <a href="/signup">sign up here</a>, or{" "}
          <a href="/login">log in here</a>. Coaches should create a new account
          even if they have participated in the EMCC in a past year. An
          individual registration costs $20.00 while registering a team of
          between two to four students costs $60.00. The payment will not be
          collected when coaches make an account; rather, invoices will be sent
          shortly after January 20th, in which a link will be included for the
          online payment. Registration will end on January 20th. */}
        </Typography>
        <br />
        <Typography variant="h3" align="center">
          Who can attend?
        </Typography>
        <br />
        <Typography variant="body1">
          We welcome anybody in 8th grade or below to attend the EMCC!
          Competitors come from all around the world.
          <br />
          <br />
          Coaches may register as many teams as they would like. All students
          who participate will be on a team, even if they register as an
          individual without a team. Individuals who were not registered with a
          team will be put into teams with each other at random. However, before
          creating teams of individuals, individuals will be placed into
          registered teams with less than four students. (If you are the coach
          of a team with less than 4 people and you would not like additional
          individuals on your team, please reach out to us. We would be happy to
          accomodate you!)
          <br />
          <br />
        </Typography>

        <Typography variant="h3" align="center">
          How is the competition formatted?
        </Typography>
        <br />
        <Typography variant="body1">
          The EMCC consists of two individual rounds and two team rounds. See
          the <a href="/contest">contest section</a> of our website for a
          detailed breakdown of the rules of the EMCC competition. Past
          competitions can be found in the{" "}
          <a href="/archives">archives section</a>.
          <br />
          <br />
        </Typography>

        <Typography variant="h3" align="center">
          More questions?
        </Typography>
        <br />
        <Typography variant="body1">
          Please reach out to us at{" "}
          <a href="mailto:exetermathclub@gmail.com">exetermathclub@gmail.com</a>
          ! We would be happy to assist you.
        </Typography>
      </SContent>
    </Box>
  );
};

export default Home;
