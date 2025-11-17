import React, { useState, useEffect } from "react";
import "./App.css";

import { navigate } from "@reach/router";
import { Typography } from "@material-ui/core";
import { pageWidth } from "./config";

import styled from "styled-components";
import EmailIcon from "@material-ui/icons/Email";
import InstagramIcon from "@material-ui/icons/Instagram";

import { contestYear } from "./config";
import logo from "./assets/logo.png";

const userStatus = {
  NoUser: "no-user",
  UserLoaded: "user-loaded"
};

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
  position: fixed;
  width: 100vw;
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
  max-width: ${pageWidth}px;
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
      ? "linear-gradient(0deg, #9B1D3116 0%, #9B1D3100 60%) !important"
      : "transparent"};
  color: ${({ $active }) => ($active ? "#9B1D31 !important" : "#888")};
  color: ${({ $onHome, $shrink }) =>
    $onHome && !$shrink ? "#444 !important" : "#888"};
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

export const EMCCNav = ({ authStatus }) => {
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
    navigate(path).then(() => {
      // route change + render has finished
      window.scrollTo(0, 0);
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 10);
    });
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
          onClick={() => go("/schedule")}
          $active={currentUrl === "/schedule"}
          $onHome={currentUrl === "/"}
          $shrink={shrink}
        >
          Schedule
        </Item>
        <Item
          onClick={() => go("/contest")}
          $active={currentUrl === "/contest"}
          $onHome={currentUrl === "/"}
          $shrink={shrink}
        >
          Contest
        </Item>
        <Item
          onClick={() => go("/archives")}
          $active={currentUrl === "/archives"}
          $onHome={currentUrl === "/"}
          $shrink={shrink}
        >
          Archives
        </Item>
        <Item
          onClick={() => go("/aboutus")}
          $active={currentUrl === "/aboutus"}
          $onHome={currentUrl === "/"}
          $shrink={shrink}
        >
          About Us
        </Item>

        {authStatus === userStatus.NoUser ? (
          <Item
            onClick={() => go("/signup")}
            $active={currentUrl === "/signup"}
            $onHome={currentUrl === "/"}
            $shrink={shrink}
          >
            Register
          </Item>
        ) : (
          <Item
            onClick={() => go("/dashboard")}
            $active={currentUrl === "/dashboard"}
            $onHome={currentUrl === "/"}
            $shrink={shrink}
          >
            Dashboard
          </Item>
        )}
      </Row>
    </Bar>
  );
};

const FootContainer = styled.div`
  max-width: ${pageWidth}px;
  margin-left: auto;
  margin-right: auto;
  display: block;
  width: 100%;
  text-align: center;
  height: 100%;
`;

const IconRow = styled.div`
  width: 100%;
  display: block;
  padding: 10px 0px 20px 0px;
  margin: 0px 0px 0px 0px;
`;

const LinkIcon = styled.a`
  margin: 0 5px;
  color: #888;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  padding: 0px 5px;
  height: 30px;
  text-align: center;

  &:hover {
    color: #777;
  }
`;

export const EMCCFoot = () => {
  return (
    <footer
      style={{
        position: "relative",
        bottom: "0",
        width: "100%",
        backgroundColor: "#eee",
        padding: "0px",
        color: "#222222",
        height: "100px"
      }}
    >
      <FootContainer>
        <IconRow>
          <LinkIcon href="mailto:exetermathclub@gmail.com">
            <EmailIcon fontSize="small" />
          </LinkIcon>
          <LinkIcon href="https://www.instagram.com/exetermathclub/">
            <InstagramIcon fontSize="small" />
          </LinkIcon>
        </IconRow>

        <Typography variant="body" style={{ color: "#aaa" }}>
          &copy; {contestYear} Exeter Math Club.
        </Typography>
      </FootContainer>
    </footer>
  );
};
