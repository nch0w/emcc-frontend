import React from "react";

import { Box, Typography } from "@material-ui/core";

const PaymentTab = () => {
  return (
    <Box>
      <Typography variant="body1">
        <a
          href="https://secure.touchnet.com/C25385_ustores/web/store_cat.jsp?STOREID=2&CATID=55"
          target="_blank"
          rel="noopener noreferrer"
        >
          Click here for the payment portal
        </a>
        .
        <br />
        <br />
        The registration fee is $60.00 per team and $20.00 per each additional
        individual.
        <br />
        <br />
        As long as the correct number of teams/individuals are paid for, the
        registration is good. In particular, even though the portal prompts for
        student and team names, these questions are obsolete; it is okay to
        enter placeholder names. The "Edit Competitors" tab in the dashboard is
        the only place where student and team names need to be entered
        correctly.
        <br />
        <br />
        After registration closes on January 9th, you will receive an email
        confirming your payment.
      </Typography>{" "}
    </Box>
  );
};

export default PaymentTab;
