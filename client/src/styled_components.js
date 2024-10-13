import {
  BottomNavigation,
  BottomNavigationAction,
  Container,
  Typography
} from "@material-ui/core";
import { styled } from "@material-ui/core/styles";

// NAVIGATION BAR
export const SNav = styled(BottomNavigation)({
  background: "rgb(230, 230, 230)",
  boxShadow: "#9B1D31 0px 1px 0px",
  position: "absolute",
  width: "100vw",
  zIndex: "100",
  top: "0"
});

export const SNavButton = styled(BottomNavigationAction)({
  color: "#999999"
  // TODO: figure out how to change the selected button color
  /*
    root: {
        '&$selected': {
            color: "#AAAAAA"
        }
    }
    */
});

// ALL PAGES

export const SHeading = styled(Typography)({
  textAlign: "center",
  paddingTop: "20px",
  paddingBottom: "40px"
});

export const SContent = styled(Container)({
  textAlign: "left",
  paddingBottom: "40px",
  marginBottom: "40px"
});

export const SContentHeading = styled(Typography)({
  textAlign: "center",
  paddingTop: "10px",
  paddingBottom: "10px"
});

// HOME PAGE

export const SHero = styled(Container)({
  background: "#9B1D31",
  height: "0vh",
  minHeight: "fit-content",
  color: "#EEEEEE",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center"
});

export const SHeroHeading = styled(Typography)({
  fontSize: "calc(10vw + 4.0rem)"
});

export const SHeroSubheading = styled(Typography)({
  paddingBottom: "15px"
});
