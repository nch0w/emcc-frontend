import React, { useState, useEffect } from "react";
import "./App.css";

import { Router } from "@reach/router";
import {
  CssBaseline,
  Box,
  Typography,
  createMuiTheme,
  MuiThemeProvider
} from "@material-ui/core";
import styled from "styled-components";

import Home from "./pages/home";
import Contest from "./pages/contest";
import Travel from "./pages/travel";
import AboutUs from "./pages/aboutus";
import Archives from "./pages/archives";
import Schedule from "./pages/schedule";
import SignUp from "./pages/signup";
import Login from "./pages/login";
import Guts from "./pages/guts";
import Dashboard from "./pages/dashboard";
import Payment from "./pages/payment";
import axios from "axios";

import { emccServerUrl, pageWidth } from "./config";
import Verify from "./pages/verify";
import { EMCCFoot, EMCCNav } from "./footNav.js";

// begin authentication plumbing code
export const userStatus = {
  NoUser: "no-user",
  UserLoaded: "user-loaded"
};

export const UserContext = React.createContext();

// TODO this is a band-aid fix for the blue selected nav buttons
const theme = createMuiTheme({
  typography: {
    fontFamily: "Lato"
  },
  palette: {
    primary: {
      main: "#9B1D31"
    }
  }
});

class PrivateRoute extends React.Component {
  static contextType = UserContext;

  render() {
    let { as: PrivateComponent, ...props } = this.props;
    return this.context.status === userStatus.NoUser ? (
      <Box>
        <Typography variant="h5">
          Unable to show info. Please log in first.
        </Typography>
        <Login />
      </Box>
    ) : (
      <PrivateComponent {...props} />
    );
  }
}

const PageBox = styled.div`
  position: relative;
  max-width: ${pageWidth}px;
  margin-left: auto;
  margin-right: auto;
  padding-top: 80px;
  min-height: calc(100vh - 120px);
`;

const App = () => {
  const [coachInfo, setCoachInfo] = useState({});
  const [teams, setTeams] = useState([]);
  const [individuals, setIndividuals] = useState([]);
  const [authStatus, setAuthStatus] = useState(userStatus.NoUser);
  const [indivResults, setIndivResults] = useState([]);
  const [teamResults, setTeamResults] = useState([]);

  useEffect(() => {
    axios
      .post(emccServerUrl + "/auth/user", {}, { timeout: 5000 })
      .then((response) => {
        setAuthStatus(userStatus.UserLoaded);
        setCoachInfo(response.data.coachInfo);
        setTeams(response.data.teams);
        setIndividuals(response.data.individuals);
        setIndivResults(response.data.indivResults);
        setTeamResults(response.data.teamResults);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <MuiThemeProvider theme={theme}>
      <div className="App">
        <CssBaseline />
        <UserContext.Provider
          value={{
            authStatus,
            setAuthStatus,
            coachInfo,
            teams,
            individuals,
            indivResults,
            teamResults,
            setCoachInfo,
            setTeams,
            setIndividuals,
            setIndivResults,
            setTeamResults
          }}
        >
          <EMCCNav authStatus={authStatus} />

          <PageBox>
            <Router>
              <Home path="/" />
              <Schedule path="/schedule" />
              <Contest path="/contest" />
              <Travel path="/travel" />
              <AboutUs path="/aboutus" />
              <Archives path="/archives" />
              <Login path="/login" />
              <Guts path="/guts" />
              <SignUp path="/signup" />
              <PrivateRoute as={Dashboard} path="/dashboard" />
              <Payment path="/payment" />
              <Verify path="/verify/:tokenId" />
            </Router>
          </PageBox>

          <div style={{ marginBottom: 20 }} />

          <EMCCFoot />
        </UserContext.Provider>
      </div>
    </MuiThemeProvider>
  );
};

export default App;
