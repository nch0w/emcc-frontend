import React from "react";

import { Box, Typography } from "@material-ui/core";
import MaterialTable from "material-table";
import { tableIcons } from "./tableIcons";

const ResultsTab = ({ indivResults, teamResults, loading }) => {
  return (
    <Box>
      <Typography variant="body1">
        After the competition, results can be viewed here.
      </Typography>
      <br />
      <br />
      <Typography variant="h3" align="center">
        Individual Results
      </Typography>
      <br />
      <MaterialTable
        title="Speed Round"
        options={{ search: false, sorting: false, draggable: false }}
        icons={tableIcons}
        columns={[
          { title: "Name", field: "name" },
          { title: "#/20", field: "speedScore" },
          { title: "Rank", field: "speedRank" },
          { title: "Distribution", field: "speedDistribution" }
        ]}
        isLoading={loading}
        data={indivResults}
        localization={{
          body: { emptyDataSourceMessage: "No results." }
        }}
      />
      <br />
      <br />
      <MaterialTable
        title="Accuracy Round"
        options={{ search: false, sorting: false, draggable: false }}
        icons={tableIcons}
        columns={[
          { title: "Name", field: "name" },
          { title: "#/10", field: "accuracyScore" },
          { title: "Rank", field: "accuracyRank" },
          { title: "Distribution", field: "accuracyDistribution" }
        ]}
        isLoading={loading}
        data={indivResults}
        localization={{
          body: { emptyDataSourceMessage: "No results." }
        }}
      />
      <br />
      <br />
      <MaterialTable
        title="Overall"
        options={{ search: false, sorting: false, draggable: false }}
        icons={tableIcons}
        columns={[
          { title: "Name", field: "name" },
          { title: "#/40", field: "overallScore" },
          { title: "Rank", field: "overallRank" }
        ]}
        isLoading={loading}
        data={indivResults}
        localization={{
          body: { emptyDataSourceMessage: "No results." }
        }}
      />
      <br />
      <br />
      <Typography variant="h3" align="center">
        Team Results
      </Typography>
      <br />
      <MaterialTable
        title="Team Round"
        options={{ search: false, sorting: false, draggable: false }}
        icons={tableIcons}
        columns={[
          { title: "Team", field: "name" },
          { title: "#/15", field: "teamScore" },
          { title: "Rank", field: "teamRank" },
          { title: "Distribution", field: "teamDistribution" }
        ]}
        isLoading={loading}
        data={teamResults}
        localization={{
          body: { emptyDataSourceMessage: "No results." }
        }}
      />
      <br />
      <br />
      <MaterialTable
        title="Guts Round"
        options={{ search: false, sorting: false, draggable: false }}
        icons={tableIcons}
        columns={[
          { title: "Team", field: "name" },
          { title: "#/160", field: "gutsScore" },
          { title: "Rank", field: "gutsRank" },
          { title: "Distribution", field: "gutsDistribution" },
          {
            title: "Estimation Scores (out of 5)",
            field: "gutsEstimation"
          }
        ]}
        isLoading={loading}
        data={teamResults}
        localization={{
          body: { emptyDataSourceMessage: "No results." }
        }}
      />
      <br />
      <br />
      <MaterialTable
        title="Overall"
        options={{ search: false, sorting: false, draggable: false }}
        icons={tableIcons}
        columns={[
          { title: "Team", field: "name" },
          {
            title: "Cumulative Individual (out of 160)",
            field: "individualsCumulative"
          },
          { title: "Sweepstakes (out of 500)", field: "sweepsScore" },
          { title: "Rank", field: "sweepsRank" }
        ]}
        isLoading={loading}
        data={teamResults}
        localization={{
          body: { emptyDataSourceMessage: "No results." }
        }}
      />
    </Box>
  );
};

export default ResultsTab;
