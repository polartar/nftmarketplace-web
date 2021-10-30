import {React, Fragment, useEffect, useState } from 'react'

import {
  createTheme,
  ThemeProvider,
  StyledEngineProvider,
  Zoom,
  Fab,
  useScrollTrigger,
  Box,
  CssBaseline,
} from '@mui/material';

import {makeStyles} from "@mui/styles"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import "./App.css";
import Footer from "./Components/Footer/footer";
import { AppRouter } from "./Router/Router";


const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    bottom: theme.spacing(8),
    right: theme.spacing(2),
    zIndex: 999,
  }
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
    // mode: "dark",
    primary: {
      main: "#d32f2f",
    },
    secondary: {
      main: "#ef5350",
    },
    // inherit: {
    //   main: "white",
    // },
  },
  overrides : {
    // MuiTab : {
    //   textColorInherit : {
    //     opacity :1,
    //   }
    // }
  }
});

function App(props) {
  return (
    <Fragment>
      
      <div className="App">
        <Box id="back-to-top-anchor" />
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
          <CssBaseline/>
            <AppRouter />
            <ScrollTop {...props}>
              <Fab color="primary" size="small" aria-label="scroll back to top">
                <KeyboardArrowUpIcon />
              </Fab>
            </ScrollTop>
          </ThemeProvider>
        </StyledEngineProvider>
      </div>
      <Footer />
    </Fragment>
  );
}

export default App;


// let [loading, setLoading] = useState(true);

// useEffect(() => {
//   setTimeout(() => {
//     setLoading(false);
//   }, 1000);
// }, []);

// if (loading) {
//   return (
//     <div className="loaderContainer">
//       <CircularProgress color="secondary" />
//     </div>
//   );
// }