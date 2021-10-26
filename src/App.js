import React from 'react'
import "./App.css";
import Footer from "./Components/Footer/footer";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Fab from "@material-ui/core/Fab";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Zoom from "@material-ui/core/Zoom";
import { createTheme } from "@material-ui/core/styles";
import { AppRouter } from "./Router/Router";
import { ThemeProvider } from "@material-ui/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useEffect, useState } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    bottom: theme.spacing(8),
    right: theme.spacing(2),
    zIndex: 999,
  },
}));

function ScrollTop(props) {
  const { children, window } = props;
  const classes = useStyles();
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      "#back-to-top-anchor"
    );

    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <Zoom in={trigger}>
      <div onClick={handleClick} role="presentation" className={classes.root}>
        {children}
      </div>
    </Zoom>
  );
}

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#d32f2f",
    },
    secondary: {
      main: "#ef5350",
    },
    inherit: {
      main: "white",
    },
    // error: {
    //   main: red.A400,
    // },
  },
});

function App(props) {
  let [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="loaderContainer">
        <CircularProgress color="secondary" />
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="App">
        <Toolbar id="back-to-top-anchor" />
        <ThemeProvider theme={theme}>
          <AppRouter />
          <ScrollTop {...props}>
            <Fab color="primary" size="small" aria-label="scroll back to top">
              <KeyboardArrowUpIcon />
            </Fab>
          </ScrollTop>
        </ThemeProvider>
      </div>
      <Footer />
    </React.Fragment>
  );
}

export default App;
