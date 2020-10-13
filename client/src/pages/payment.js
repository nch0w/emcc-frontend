import React from "react";

import { Box, Typography } from "@material-ui/core";
import { Link } from "@reach/router";

import {
  indivEarlyCost,
  indivLateCost,
  teamEarlyCost,
  teamLateCost,
  minTeamMembersPerTeam,
  maxTeamMembersPerTeam,
  CheckInstructions
} from "../config";
import { SHeading, SContent } from "../styled_components";

const Payment = () => {
  return (
    <Box>
      <SHeading variant="h2">Payment Information</SHeading>
      <SContent>
        <Typography variant="h4" align="center">
          How much does EMCC cost?
        </Typography>
        <br />
        <Typography variant="body1">
          It costs {indivEarlyCost} to register each individual during early
          registration, and {indivLateCost} to register each individual during
          late registration.
          <br />
          It costs {teamEarlyCost} to register each team of{" "}
          {minTeamMembersPerTeam} - {maxTeamMembersPerTeam} students during
          early registration, and {teamLateCost} to register each team during
          late registration.
        </Typography>
        <br />
        <Typography variant="h4" align="center">
          How Can I Pay My Registration Fees?
        </Typography>
        <br />
        <CheckInstructions />
        <br />
        <Typography variant="h4" align="center">
          Travel Expenses
        </Typography>
        <br />
        <Typography variant="body1">
          We'll arrange a shuttle to and from nearby airports, but competitors
          will have to cover other travel expenses themselves. We are unable to
          compensate competitors for any travel expenses like gas or
          bus/train/airplane tickets.
        </Typography>
        <br />
        <Typography variant="h4" align="center">
          Lodging
        </Typography>
        <br />
        <Typography variant="body1">
          We provide 1 night of hotel stay at the Exeter Fairfield Inn for each{" "}
          <b>
            U.S.-based team traveling from outside a 350-mile radius from the
            school
          </b>
          . Two hotel rooms are guaranteed, and a third room may be compensated
          on a first-come first-serve basis (contact{" "}
          <Link to="mailto:exetermathclub@gmail.com">
            exetermathclub@gmail.com
          </Link>
          ). There are transportation services (such as Flightline and Green
          Rides USA) between airports and Exeter.
        </Typography>
      </SContent>
    </Box>
  );
};

export default Payment;
