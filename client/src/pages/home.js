import React from "react";

import { Box, Typography } from "@material-ui/core";

import { contestDate } from "../config";
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
          Registration for EMCC 2026 is open! Sign up{" "}
          <a href="/signup" style={{ color: "#fff", fontWeight: 700 }}>
            here
          </a>
          .
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
                maxWidth: "90%",
                width: 550,
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
          Academy in New Hampshire. Every January since 2010, students have come
          from around the world to compete in person at Exeter.
          <br />
          <br />
          Registration for EMCC 2026 is open! The 2026 EMCC will take place on{" "}
          <b>Sunday, January 18th, 2026</b> (MLK weekend). Registration remains
          open until January 9th, 2026. Registering for the EMCC takes three
          steps:
          <ol>
            <li>
              Create a coach account <a href="/signup">here</a>. (Returning
              parents and coaches should create a new account, as server data is
              reset each year.)
            </li>
            <li>Add teams and individuals in the coach portal.</li>
            <li>
              Complete the payment through the link in the coach portal. The
              registration fee is $60.00 per team and $20.00 per additional
              individual.
            </li>
          </ol>
          Coaches may register as many teams and individuals as they would like.
          Students do not need to create an account.
          <br />
          <br />
          You can read more about the competition <a href="/contest">here</a>,
          try some of our past problems <a href="/archives">here</a> or learn
          more about the Math Club <a href="/aboutus">here</a>.
          <br />
          <br />
          If you have any questions, please reach out to us at{" "}
          <a href="mailto:exetermathclub@gmail.com">exetermathclub@gmail.com</a>
          !
        </Typography>
      </SContent>
    </Box>
  );
};

export default Home;
