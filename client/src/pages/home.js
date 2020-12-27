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
      <SHero>
        <SHeroHeading variant="h1">EMCC</SHeroHeading>
        <SHeroSubheading variant="h3">
          The Exeter Math Club Competition
        </SHeroSubheading>
        <SHeroSubheading variant="h5">{contestDate}, Online</SHeroSubheading>
        <SHeroSubheading variant="h6">
          <Link
            to={authStatus === userStatus.UserLoaded ? "/dashboard" : "/signup"}
            style={{ color: "white" }}
          >
            {contestStatus}
          </Link>
        </SHeroSubheading>
      </SHero>
      <br />
      <br />
      <br />
      <SContent>
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
              src={require("../assets/janestreet_homepage.jpg")}
            />
          </a>
        </Typography>

        <Typography variant="h3" align="center">
          What is EMCC?
        </Typography>
        <br />
        <Typography variant="body1">
          The Exeter Math Club Competition is a middle-school mathematics
          competition held annually at Phillips Exeter Academy in Exeter, New
          Hampshire. EMCC provides middle schoolers a event where they can join
          like-minded peers from a mathematical community spanning the globe.
        </Typography>
        <br />
        <Typography variant="body1">
          While designing EMCC, we've taken inspiration from the contests that
          we ourselves attend and formatted our contest similarly. This means
          that attending EMCC will not only be an enjoyable experience but will
          also prepare you for future contests.
        </Typography>
        <br />
        <Typography variant="h3" align="center">
          Who can attend?
        </Typography>
        <br />
        <Typography variant="body1">
          Anyone in 8th grade or below. We accept registration as teams of
          students from the same school or individuals. Teams consist of up to
          four people, so we will combine individuals into teams of four.
          Competitors come from all around the world, and we hope to reach even
          more students this year due to the online format.
        </Typography>
      </SContent>
    </Box>
  );
};

export default Home;
