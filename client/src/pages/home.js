import React from "react";

import { Box, Typography } from "@material-ui/core";

import { contestDate, contestStatus } from "../config";
import { SHero, SHeroSubheading, SContent } from "../styled_components";
import { SpecialHeader } from "../homepageLogo";

const Home = () => {
  return (
    <Box>
      <SpecialHeader />
      <SHero>
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
      <SContent>
        <Typography variant="h4" align="center">
          Sponsored by
          <br />
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.hudsonrivertrading.com/"
          >
            <img
              id="hrt_logo"
              alt="HRT Logo"
              style={{
                verticalAlign: "middle",
                maxHeight: 290,
                marginBottom: 20
              }}
              src={require("../assets/hudsonRiverTrading.png")}
            />
          </a>
        </Typography>

        <br />

        <Typography variant="body1">
          The Exeter Math Club Competition is an annual math competition for
          middle schoolers, written and run by students at Phillips Exeter
          Academy in New Hampshire. Every January since 2010, teams of four have
          come from around the world to compete in person at Exeter.
          <br />
          <br />
          You can read more about the competition <a href="/contest">here</a>,
          try some of our past problems <a href="/archives">here</a> or learn
          more about us <a href="/aboutus">here</a>.
          <br />
          <br />
          Registration for the 2026 EMCC will open on November 19th. The
          competition date will be announced alongside this announcement.
          <br />
          <br />
          If you have any questions, please reach out to us at{" "}
          <a href="mailto:exetermathclub@gmail.com">exetermathclub@gmail.com</a>
          ! We would be happy to help you.
        </Typography>
      </SContent>
    </Box>
  );
};

export default Home;
