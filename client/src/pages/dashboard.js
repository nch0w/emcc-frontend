import React, { useState, useContext, useEffect, useRef } from "react";

import { Box, Paper } from "@material-ui/core";
import { Tabs, Tab } from "@material-ui/core";
import { useNavigate } from "@reach/router";
import axios from "axios";
import Swal from "sweetalert2";

import { UserContext, userStatus } from "../App";
import { emccServerUrl } from "../config";
import { SHeading, SContentHeading } from "../styled_components";

import CompetitorsTab from "./dashboardTabs/competitorsTab";
import CoachInfoTab from "./dashboardTabs/coachInfoTab";
import ResultsTab from "./dashboardTabs/resultsTab";

const Dashboard = () => {
  const navigate = useNavigate();

  const {
    coachInfo,
    teams,
    individuals,
    indivResults,
    teamResults,
    setCoachInfo,
    setTeams,
    setIndividuals,
    setIndivResults,
    setTeamResults,
    authStatus,
    setAuthStatus
  } = useContext(UserContext);

  const [loading, setLoading] = useState(false);
  const skipUserFetch = useRef(false);

  useEffect(() => {
    if (skipUserFetch.current) {
      skipUserFetch.current = false;
      return;
    }
    if (authStatus === userStatus.UserLoaded) return;
    setLoading(true);
    axios
      .post(emccServerUrl + "/auth/user", {}, { timeout: 10000 })
      .then((response) => {
        setAuthStatus(userStatus.UserLoaded);
        setCoachInfo(response.data.coachInfo);
        setTeams(response.data.teams);
        setIndividuals(response.data.individuals);
        setIndivResults(response.data.indivResults);
        setTeamResults(response.data.teamResults);
        setLoading(false);
      })
      .catch((error) => {
        Swal.fire(
          "Error",
          "There was an error fetching your data. Please try again later.",
          "error"
        ).then(() => {
          navigate("/"); // change this to your target route
        });
        setLoading(false);
        console.log(error);
      });
  }, [
    navigate,
    authStatus,
    setAuthStatus,
    setCoachInfo,
    setTeams,
    setIndividuals,
    setIndivResults,
    setTeamResults
  ]);

  const [activeTab, setActiveTab] = useState("view-competitors");

  const handleTabClicked = (newValue) => {
    switch (newValue) {
      case "view-competitors":
        setActiveTab("view-competitors");
        break;
      case "view-coach-info":
        setActiveTab("view-coach-info");
        break;
      case "view-results":
        setActiveTab("view-results");
        break;
      default:
        break;
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case "view-competitors":
        return (
          <CompetitorsTab
            teams={teams}
            individuals={individuals}
            setTeams={setTeams}
            setIndividuals={setIndividuals}
            loading={loading}
          />
        );
      case "view-coach-info":
        return (
          <CoachInfoTab
            coachInfo={coachInfo}
            setCoachInfo={setCoachInfo}
            navigate={navigate}
            setAuthStatus={setAuthStatus}
            userStatus={userStatus}
            setTeams={setTeams}
            setIndividuals={setIndividuals}
            setIndivResults={setIndivResults}
            setTeamResults={setTeamResults}
            skipUserFetch={skipUserFetch}
          />
        );
      case "view-results":
        return (
          <ResultsTab
            indivResults={indivResults}
            teamResults={teamResults}
            loading={loading}
          />
        );
      default:
        return;
    }
  };

  function firstNamify(name) {
    if (!name) return "";
    return (
      name.trim().split(/\s+/)[0][0].toUpperCase() +
      name.trim().split(/\s+/)[0].slice(1)
    );
  }

  return (
    <Box
      style={{
        paddingLeft: 30,
        paddingRight: 30
      }}
    >
      <SHeading variant="h2">Dashboard</SHeading>
      <SContentHeading variant="h5" align="center">
        {coachInfo.name
          ? `Welcome, ${firstNamify(coachInfo.name)}! `
          : "Welcome! "}
      </SContentHeading>
      <br /> <br />
      <Paper elevation={3}>
        <Tabs
          value={activeTab}
          indicatorColor="primary"
          textColor="primary"
          onChange={(_event, value) => handleTabClicked(value)}
        >
          <Tab value="view-competitors" label="Edit Competitors" />

          <Tab value="view-coach-info" label="Edit Coach Info" />

          <Tab value="view-results" label="View Results" />
        </Tabs>
      </Paper>
      <br />
      {renderTab()}
    </Box>
  );
};

export default Dashboard;
