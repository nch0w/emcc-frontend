import React, { useState, useEffect } from "react";
import "./App.css";

import { Router, navigate } from "@reach/router";
import {
  CssBaseline,
  Box,
  Typography,
  createMuiTheme,
  MuiThemeProvider
} from "@material-ui/core";
import {
  Home as HomeIcon,
  Assignment as ContestIcon,
  FlightTakeoff as TravelIcon,
  ContactMail as ContactIcon,
  PersonAdd as SignUpIcon,
  LockOpen as LoginIcon,
  Dashboard as DashboardIcon,
  AttachMoney as PaymentIcon,
  BlurLinear as ArchivesIcon
} from "@material-ui/icons";

import { SNav, SNavButton } from "./styled_components";

import Home from "./pages/home";
import Contest from "./pages/contest";
import Travel from "./pages/travel";
import Contact from "./pages/contact";
import Archives from "./pages/archives";
import SignUp from "./pages/signup";
import Login from "./pages/login";
import Guts from "./pages/guts";
import Dashboard from "./pages/dashboard";
import Payment from "./pages/payment";
import axios from "axios";

import { contestYear, emccServerUrl } from "./config";
import Verify from "./pages/verify";

/*
TODO: is EMCC 2021 even happening? Is it remote?
TODO: make styles for each component using material-ui styles
background for hero and nav should be #9B1D31
see http://exeter-math.appspot.com/ for more details
TODO: confirm all config values with Mr. Feng
TODO: invoices
*/

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
// end authentication plumbing code

const parseCurrentPageFromUrl = () => {
  const currentFullUrl = window.location.href.split("/");
  let currentPage = "";
  // we are on the home page (with or without a final slash)
  if (
    currentFullUrl.length === 3 ||
    (currentFullUrl.length === 4 && currentFullUrl[3] === "")
  )
    currentPage = "";
  // last character is a slash
  else if (currentFullUrl[currentFullUrl.length - 1] === "")
    currentPage = currentFullUrl[currentFullUrl.length - 2];
  // last character is not a slash
  else currentPage = currentFullUrl[currentFullUrl.length - 1];
  return currentPage;
};

const EMCCNav = ({ authStatus }) => {
  // EMCCNav state must be equal to the "value" prop of
  // the BottomNavigationAction that we want to highlight
  // aka the current page
  const currentPage = parseCurrentPageFromUrl();
  const [currentUrl, setUrl] = useState("/" + currentPage);
  const handleButtonClicked = (_, newUrl) => {
    navigate(newUrl); // React Router's navigation
    setUrl(newUrl); // If you're also updating a state variable (optional)
  };

  return (
    <SNav value={currentUrl} showLabels onChange={handleButtonClicked}>
      <SNavButton label="Home" value="/" icon={<HomeIcon />} />
      <SNavButton label="Contest" value="/contest" icon={<ContestIcon />} />
      {/* <SNavButton label="Travel" value="/travel" icon={<TravelIcon />} /> */}
      <SNavButton label="Archives" value="/archives" icon={<ArchivesIcon />} />
      <SNavButton label="Contact" value="/contact" icon={<ContactIcon />} />

      {authStatus === userStatus.NoUser ? (
        <SNavButton label="Register" value="/signup" icon={<SignUpIcon />} />
      ) : (
        <SNavButton
          label="Dashboard"
          value="/dashboard"
          icon={<DashboardIcon />}
        />
      )}

      {/* <SNavButton label="Payment" value="/payment" icon={<PaymentIcon />} /> */}
    </SNav>
  );
};

const App = () => {
  const [coachInfo, setCoachInfo] = useState({});
  const [teams, setTeams] = useState([]);
  const [individuals, setIndividuals] = useState([]);
  const [authStatus, setAuthStatus] = useState(userStatus.NoUser);

  useEffect(() => {
    axios
      .post(emccServerUrl + "/auth/user", {}, { timeout: 5000 })
      .then((response) => {
        setAuthStatus(userStatus.UserLoaded);
        setCoachInfo(response.data.coachInfo);
        setTeams(response.data.teams);
        setIndividuals(response.data.individuals);
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
            setCoachInfo,
            setTeams,
            setIndividuals
          }}
        >
          <EMCCNav authStatus={authStatus} />
          <Router>
            <Home path="/" />
            <Contest path="/contest" />
            <Travel path="/travel" />
            <Contact path="/contact" />
            <Archives path="/archives" />
            <Login path="/login" />
            <Guts path="/guts" />
            <SignUp path="/signup" />
            <PrivateRoute as={Dashboard} path="/dashboard" />
            <Payment path="/payment" />
            <Verify path="/verify/:tokenId" />
          </Router>
          <div style={{ marginBottom: 100 }} />
          <footer
            style={{
              position: window.screen.availWidth > 600 ? "fixed" : "relative",
              bottom: "0",
              width: "100%",
              backgroundColor: "rgb(230,230,230)",
              padding: "20px",
              color: "#222222",
              boxShadow: "rgba(0,0,0,0.8) 0px 1px 6px",
              zIndex: 999999,
              height: window.screen.availWidth > 600 ? "auto" : 80
            }}
          >
            <Typography variant="body">
              &copy; Copyright {contestYear} Exeter Math Club.
            </Typography>
            <Box style={{ float: "right" }}>
              <Typography variant="body" style={{ marginRight: "15px" }}>
                Sponsored by Jane Street.
              </Typography>
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
                    height: 20
                  }}
                  src={require("./assets/jane_street_fr.png")}
                />
              </a>
            </Box>
          </footer>
        </UserContext.Provider>
      </div>
    </MuiThemeProvider>
  );
};

export default App;
