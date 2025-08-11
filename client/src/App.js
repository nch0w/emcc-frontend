import React, { useState, useEffect } from "react";
import { Location } from "@reach/router";
import "./App.css";

import { Router, navigate, globalHistory } from "@reach/router";
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
import styled from "styled-components";

import Home from "./pages/home";
import Contest from "./pages/contest";
import Travel from "./pages/travel";
import AboutUs from "./pages/aboutus";
import Archives from "./pages/archives";
import SignUp from "./pages/signup";
import Login from "./pages/login";
import Guts from "./pages/guts";
import Dashboard from "./pages/dashboard";
import Payment from "./pages/payment";
import axios from "axios";

import { contestYear, emccServerUrl } from "./config";
import Verify from "./pages/verify";
import logo from "./assets/logo.png";

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

const Bar = styled.nav`
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgb(230, 230, 230);
  box-shadow: #9b1d31 0px 1px 0px;
  padding-left: 0px;
  padding-right: 0px;
  padding-bottom: 0px;
  transition: height 0.2s;
  height: ${({ shrink }) => (shrink ? "40px" : "80px")};
`;

const Row = styled.div`
  max-width: 1200px;
  margin-top: 0px;
  margin-bottom: 0px;
  margin-left: auto;
  margin-right: auto;
  padding: 0px 0px;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  transition: height 0.2s;
  gap: 0px;
  align-items: center;
  height: ${({ shrink }) => (shrink ? "40px" : "80px")};
`;

const Item = styled.button`
  display: inline-flex;
  position: relative;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding-left: 20px;
  padding-right: 20px;
  margin-bottom: 0px;
  margin-top: auto;
  background: ${({ $active }) =>
    $active
      ? "linear-gradient(0deg, #9B1D3116 0%, #9B1D3100 40%) !important"
      : "transparent"};
  color: ${({ $active }) => ($active ? "#9B1D31 !important" : "#888")};
  border: none;
  cursor: pointer;
  font: 500 14px/1.1 Lato, system-ui, -apple-system, sans-serif;

  &::after {
    content: "";
    position: absolute;
    left: 0px;
    bottom: 0px;
    width: 100%;
    background-color: #9b1d31;
    transition: 0.1s;
    width: 100%;
    height: 0px;
  }
  &:hover::after {
    height: 1px;
  }
  ${({ $active }) =>
    $active &&
    `
      &::after {
        height: 4px !important;
      }
    `}
`;
const HomePageItem = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: ${({ shrink }) => (shrink ? "40px" : "80px")};
  margin-left: 10px;
  padding-left: 10px;
  padding-right: 20px;
  width: 120px;
  border: none;
  cursor: pointer;
  transition: 5s;
  margin-top: 0px;
  padding-top: 0px;
  font: 500 14px/1.1 Lato, system-ui, -apple-system, sans-serif;
  transition: border-bottom 0.2s, height 0.2s;
  background: #0000;
`;

const EMCCNav = ({ authStatus }) => {
  // EMCCNav state must be equal to the "value" prop of
  // the BottomNavigationAction that we want to highlight
  // aka the current page
  const currentPage = parseCurrentPageFromUrl();
  const [currentUrl, setUrl] = useState("/" + currentPage);
  const [shrink, setShrink] = useState(false);
  useEffect(() => {
    let ticking = false;
    const SHRINK_AT = 80; // scroll down past this -> shrink
    const EXPAND_AT = 20; // scroll back above this -> expand

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        setShrink((prev) => (prev ? y > EXPAND_AT : y > SHRINK_AT));
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (path) => {
    navigate(path);
    setUrl(path); // keep your controlled state pattern
  };

  return (
    <Bar shrink={shrink}>
      <Row shrink={shrink}>
        <HomePageItem
          shrink={shrink}
          onClick={() => go("/")}
          $active={currentUrl === "/"}
        >
          <img
            src={logo}
            alt="EMCC Logo"
            style={{ height: "80%", width: "auto", display: "block" }}
          />
        </HomePageItem>
        <Item
          onClick={() => go("/contest")}
          $active={currentUrl === "/contest"}
        >
          Contest
        </Item>
        <Item
          onClick={() => go("/archives")}
          $active={currentUrl === "/archives"}
        >
          Archives
        </Item>
        <Item
          onClick={() => go("/aboutus")}
          $active={currentUrl === "/aboutus"}
        >
          About Us
        </Item>

        {authStatus === userStatus.NoUser ? (
          <Item
            onClick={() => go("/signup")}
            $active={currentUrl === "/signup"}
          >
            Register
          </Item>
        ) : (
          <Item
            onClick={() => go("/dashboard")}
            $active={currentUrl === "/dashboard"}
          >
            Dashboard
          </Item>
        )}
      </Row>
    </Bar>
  );
};

function ScrollToTop() {
  useEffect(() => {
    const pinToTop = () => {
      // if something grabbed focus, that can scroll the page; release it
      if (
        document.activeElement &&
        typeof document.activeElement.blur === "function"
      ) {
        document.activeElement.blur();
      }
      // hit it more than once to beat layout shifts
      const scroll = () =>
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      scroll(); // now
      requestAnimationFrame(scroll); // next paint
      setTimeout(scroll, 0); // next macrotask
    };

    // run on initial mount
    pinToTop();

    // run on route changes
    const unlisten = globalHistory.listen(() => {
      pinToTop();
    });

    return unlisten;
  }, []);

  return null;
}

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

          <Location>
            {({ location }) => <ScrollToTop location={location} />}
          </Location>

          <Router>
            <Home path="/" />
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
          <ScrollToTop />

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
