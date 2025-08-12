import React from "react";

import { Box } from "@material-ui/core";

import { ArchiveList, pageWidth } from "../config";
import { SHeading, SContent } from "../styled_components";

const Archives = () => {
  return (
    <Box>
      <SHeading variant="h2">Archives</SHeading>
      <SContent style={{ maxWidth: pageWidth }}>
        <ArchiveList />
      </SContent>
    </Box>
  );
};

export default Archives;
